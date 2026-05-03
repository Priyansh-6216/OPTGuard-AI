package com.optguard.backend.controllers;

import com.optguard.backend.models.Document;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.UserRepository;
import com.optguard.backend.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final UserRepository userRepository;
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(documentService.getDocumentsByUser(user));
    }

    @PostMapping
    public ResponseEntity<Document> addDocument(Authentication authentication, @RequestBody Document document) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        document.setUser(user);
        return ResponseEntity.ok(documentService.saveDocument(document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
