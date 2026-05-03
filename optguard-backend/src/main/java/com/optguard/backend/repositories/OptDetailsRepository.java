package com.optguard.backend.repositories;

import com.optguard.backend.models.OptDetails;
import com.optguard.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OptDetailsRepository extends JpaRepository<OptDetails, Long> {
    Optional<OptDetails> findByUser(User user);
}
