package com.optguard.backend.controllers;

import com.optguard.backend.models.Deadline;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.UserRepository;
import com.optguard.backend.repositories.DeadlineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/deadlines")
@RequiredArgsConstructor
public class DeadlineController {

    private final DeadlineRepository deadlineRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Deadline>> getMyDeadlines(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(deadlineRepository.findByUserOrderByDeadlineDateAsc(user));
    }
}
