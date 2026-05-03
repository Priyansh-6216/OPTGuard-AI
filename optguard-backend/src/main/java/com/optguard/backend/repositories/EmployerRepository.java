package com.optguard.backend.repositories;

import com.optguard.backend.models.Employer;
import com.optguard.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
    List<Employer> findByUserOrderByStartDateAsc(User user);
}
