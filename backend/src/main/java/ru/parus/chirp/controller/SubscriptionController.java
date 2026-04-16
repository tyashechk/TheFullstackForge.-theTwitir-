package ru.parus.chirp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.parus.chirp.model.dto.FollowerDto;
import ru.parus.chirp.service.SubscriptionService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/subscriptions", produces = MediaType.APPLICATION_JSON_VALUE)
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<Page<FollowerDto>> getSubscriptions(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(subscriptionService.getSubscriptions(pageable));  // ← исправлено
    }

    @PostMapping("/subscribe/{id}")
    public ResponseEntity<FollowerDto> subscribe(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.subscribe(id));
    }

    @DeleteMapping("/unsubscribe/{id}")
    public ResponseEntity<FollowerDto> unsubscribe(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.unsubscribe(id));
    }
}