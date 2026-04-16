package ru.parus.chirp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.parus.chirp.model.FollowerEntity;
import ru.parus.chirp.model.FollowerId;
import ru.parus.chirp.model.UserEntity;
import java.util.Optional;

public interface FollowerRepository extends JpaRepository<FollowerEntity, FollowerId> {
    
    // Найти подписки по подписчику
    Page<FollowerEntity> findByFollower(UserEntity follower, Pageable pageable);
    
    // Найти подписку по пользователю и подписчику
    Optional<FollowerEntity> findByUserAndFollower(UserEntity user, UserEntity follower);
    
    // Проверить, существует ли подписка
    boolean existsByUserAndFollower(UserEntity user, UserEntity follower);
}