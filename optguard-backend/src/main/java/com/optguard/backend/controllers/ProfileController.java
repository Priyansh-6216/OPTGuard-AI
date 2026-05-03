package com.optguard.backend.controllers;

import com.optguard.backend.dto.ProfileRequest;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.UserRepository;
import com.optguard.backend.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Void> updateProfile(Authentication authentication, @RequestBody ProfileRequest request) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        profileService.createOrUpdateProfile(user, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<com.optguard.backend.models.StudentProfile> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(userRepository.findByEmail(authentication.getName()).get().getStudentProfile());
    }
}
