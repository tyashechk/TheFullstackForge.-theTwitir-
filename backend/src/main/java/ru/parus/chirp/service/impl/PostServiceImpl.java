package ru.parus.chirp.service.impl;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.parus.chirp.exception.NotExistException;
import ru.parus.chirp.exception.PermissionDeniedException;
import ru.parus.chirp.mapper.PostMapper;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.TagEntity;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.post.PostDto;
import ru.parus.chirp.repository.PostRepository;
import ru.parus.chirp.repository.TagRepository;
import ru.parus.chirp.service.NotificationService;
import ru.parus.chirp.service.PostService;
import ru.parus.chirp.service.UserService;

/**
 * PostServiceImpl
 * <p>
 *     Базовая реализация сервиса постов
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private static final Pattern TAG_PATTERN = Pattern.compile("#([\\p{L}\\p{N}_-]{1,50})");

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final PostMapper postMapper;
    private final UserService userService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PostDto create(PostDto dto) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity postEntity = postMapper.toEntity(dto);
        postEntity.setOwner(user);
        postEntity.setTags(resolveTags(dto));
        var result = postMapper.toDto(postRepository.save(postEntity));
        notificationService.notifyAsyncNewPost(user.getId()); // Не ждем завершения!
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> index(final Pageable pageable) {
        Page<PostEntity> pageEntities;
        pageEntities = postRepository.findAll(pageable);
        return new PageImpl<>(pageEntities.getContent().stream().map(postMapper::toDto).toList(),
                        pageable,
                        pageEntities.getTotalElements()
                );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> searchByTag(String tag, final Pageable pageable) {
        return postRepository.findByTagName(normalizeTag(tag), pageable)
                .map(postMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto show(Long id) {
        PostEntity post = postRepository.findById(id)
                .orElseThrow(NotExistException::new);
        return postMapper.toDto(post);
    }

    @Override
    @Transactional
    public PostDto update(Long id, PostDto dto) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity post = postRepository.findById(id).orElseThrow(NotExistException::new);
        if (post.getOwner().getId().equals(user.getId())) {
            postMapper.patchUpdate(dto, post);
            post.setTags(resolveTags(dto));
            postRepository.save(post);
            return postMapper.toDto(post);
        }
        throw new PermissionDeniedException();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity post = postRepository.findById(id)
                .orElseThrow(NotExistException::new);
        if (post.getOwner().getId().equals(user.getId())) {
            postRepository.delete(post);
            return;
        }
        throw new PermissionDeniedException();
    }

    private Set<TagEntity> resolveTags(PostDto dto) {
        Set<String> names = new LinkedHashSet<>();
        if (dto.getTags() != null) {
            dto.getTags().stream()
                    .map(this::normalizeTag)
                    .filter(name -> !name.isBlank())
                    .forEach(names::add);
        }

        if (dto.getContent() != null) {
            var matcher = TAG_PATTERN.matcher(dto.getContent());
            while (matcher.find()) {
                names.add(normalizeTag(matcher.group(1)));
            }
        }

        Set<TagEntity> tags = new HashSet<>();
        for (String name : names) {
            tags.add(tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(TagEntity.builder().name(name).build())));
        }
        return tags;
    }

    private String normalizeTag(String tag) {
        if (tag == null) {
            return "";
        }
        return tag.replaceFirst("^#", "").trim().toLowerCase(Locale.ROOT);
    }
}
