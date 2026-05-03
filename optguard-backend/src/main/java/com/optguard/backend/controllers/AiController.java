package com.optguard.backend.controllers;

import com.optguard.backend.models.User;
import com.optguard.backend.repositories.UserRepository;
import com.optguard.backend.services.AiService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final UserRepository userRepository;
    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(Authentication authentication, @RequestBody ChatRequest request) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        
        String context = String.format(
            "User Context: University: %s, Degree: %s, OPT Type: %s. EAD End Date: %s. ",
            user.getStudentProfile().getUniversityName(),
            user.getStudentProfile().getDegreeLevel(),
            user.getStudentProfile().getOptType(),
            user.getOptDetails() != null ? user.getOptDetails().getEadEndDate() : "Not provided"
        );

        String answer = aiService.chat(context, request.getQuestion());
        return ResponseEntity.ok(Map.of("answer", answer));
    }

    @Data
    public static class ChatRequest {
        private String question;
    }
}
