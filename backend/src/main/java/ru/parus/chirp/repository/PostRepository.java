package ru.parus.chirp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.parus.chirp.model.PostEntity;

/**
 * PostRepository
 * <p>
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
public interface PostRepository extends JpaRepository<PostEntity, Long> {
    @Query("select distinct post from PostEntity post join post.tags tag where tag.name = :tag")
    Page<PostEntity> findByTagName(@Param("tag") String tag, Pageable pageable);
}
