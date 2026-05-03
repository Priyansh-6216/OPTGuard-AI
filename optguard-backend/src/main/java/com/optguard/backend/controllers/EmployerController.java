package com.optguard.backend.controllers;

import com.optguard.backend.models.Employer;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.EmployerRepository;
import com.optguard.backend.repositories.UserRepository;
import com.optguard.backend.services.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;
    private final EmployerService employerService;

    @GetMapping
    public ResponseEntity<List<Employer>> getMyEmployers(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(employerRepository.findByUserOrderByStartDateAsc(user));
    }

    @PostMapping
    public ResponseEntity<Employer> addEmployer(Authentication authentication, @RequestBody Employer employer) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        employer.setUser(user);
        return ResponseEntity.ok(employerRepository.save(employer));
    }

    @GetMapping("/unemployment")
    public ResponseEntity<Map<String, Long>> getUnemploymentStats(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        long used = employerService.calculateUnemploymentDays(user);
        return ResponseEntity.ok(Map.of("used", used, "remaining", 90 - used));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployer(@PathVariable Long id) {
        employerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
