package com.optguard.backend.repositories;

import com.optguard.backend.models.Deadline;
import com.optguard.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
    List<Deadline> findByUserOrderByDeadlineDateAsc(User user);
}
