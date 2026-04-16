package ru.parus.chirp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.parus.chirp.model.dto.FollowerDto;

public interface SubscriptionService {
    Page<FollowerDto> getSubscriptions(Pageable pageable);
    FollowerDto subscribe(Long id);
    FollowerDto unsubscribe(Long id);
}