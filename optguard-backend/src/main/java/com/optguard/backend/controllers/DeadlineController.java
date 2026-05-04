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
    private final com.optguard.backend.services.DeadlineService deadlineService;

    @GetMapping
    public ResponseEntity<List<Deadline>> getMyDeadlines(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(deadlineRepository.findByUserOrderByDeadlineDateAsc(user));
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportCalendar(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String icsContent = deadlineService.generateIcsContent(user);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=optguard-deadlines.ics")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/calendar")
                .body(icsContent);
    }
}
