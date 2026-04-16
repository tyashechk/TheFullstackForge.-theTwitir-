package ru.parus.chirp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.parus.chirp.exception.NotExistException;
import ru.parus.chirp.exception.NotExistUserException;
import ru.parus.chirp.mapper.FollowerMapper;
import ru.parus.chirp.model.FollowerEntity;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.FollowerDto;
import ru.parus.chirp.repository.FollowerRepository;
import ru.parus.chirp.repository.UserRepository;
import ru.parus.chirp.service.SubscriptionService;
import ru.parus.chirp.service.UserService;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final FollowerRepository followerRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final FollowerMapper followerMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<FollowerDto> getSubscriptions(Pageable pageable) {
        UserEntity currentUser = userService.getCurrentUserEntity();
        log.info("🔍 getSubscriptions: текущий пользователь ID={}, username={}", currentUser.getId(), currentUser.getUsername());
        
        Page<FollowerEntity> subscriptions = followerRepository.findByFollower(currentUser, pageable);
        log.info("📊 Найдено подписок в БД: {}", subscriptions.getTotalElements());
        
        subscriptions.forEach(sub -> {
            log.info("  → Подписка: user_id={}, follower_id={}", sub.getUser().getId(), sub.getFollower().getId());
        });
        
        return subscriptions.map(followerMapper::toDtoSubscription);
    }

    @Override
    @Transactional
    public FollowerDto subscribe(Long id) {
        log.info("=== ПОДПИСКА НА ПОЛЬЗОВАТЕЛЯ С ID: {} ===", id);
        
        UserEntity currentUser = userService.getCurrentUserEntity();
        log.info("Текущий пользователь: {} (ID: {})", currentUser.getUsername(), currentUser.getId());
        
        UserEntity followUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь с ID " + id + " не найден"));
        log.info("Подписываемся на: {} (ID: {})", followUser.getUsername(), followUser.getId());
        
        FollowerEntity follower = FollowerEntity.builder()
                .user(followUser)
                .follower(currentUser)
                .build();
        
        FollowerEntity saved = followerRepository.saveAndFlush(follower);
        log.info("Подписка сохранена: user_id={}, follower_id={}", saved.getUser().getId(), saved.getFollower().getId());
        
        return followerMapper.toDtoSubscription(saved);
    }

    @Override
    @Transactional
    public FollowerDto unsubscribe(Long id) {
        UserEntity currentUser = userService.getCurrentUserEntity();
        UserEntity followUser = userRepository.findById(id)
                .orElseThrow(NotExistUserException::new);
        
        FollowerEntity followerLink = followerRepository
                .findByUserAndFollower(followUser, currentUser)
                .orElseThrow(NotExistException::new);
        
        followerRepository.delete(followerLink);
        log.info("❌ Отписка: удалена подписка на пользователя ID={}", followUser.getId());
        
        return followerMapper.toDtoSubscription(followerLink);
    }
}