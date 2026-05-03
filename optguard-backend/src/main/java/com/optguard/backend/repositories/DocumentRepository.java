package com.optguard.backend.repositories;

import com.optguard.backend.models.Document;
import com.optguard.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser(User user);
}
