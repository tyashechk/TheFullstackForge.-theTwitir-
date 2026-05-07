package ru.parus.chirp.model.dto.post;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * PostDto
 * <p>
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@Data
public class PostDto implements Serializable {
    private Long id;
    private String content;
    private Long userId;
    private List<String> tags;
}
