package com.optguard.backend.services;

import com.optguard.backend.models.Employer;
import com.optguard.backend.models.OptDetails;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.EmployerRepository;
import com.optguard.backend.repositories.OptDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final OptDetailsRepository optDetailsRepository;

    public long calculateUnemploymentDays(User user) {
        OptDetails optDetails = optDetailsRepository.findByUser(user).orElse(null);
        if (optDetails == null || optDetails.getEadStartDate() == null) return 0;

        List<Employer> employers = employerRepository.findByUserOrderByStartDateAsc(user);
        if (employers.isEmpty()) {
            // If no employment yet, count from EAD start until today
            return ChronoUnit.DAYS.between(optDetails.getEadStartDate(), LocalDate.now());
        }

        long unemploymentDays = 0;
        LocalDate currentRefDate = optDetails.getEadStartDate();

        for (Employer emp : employers) {
            if (emp.getStartDate().isAfter(currentRefDate)) {
                unemploymentDays += ChronoUnit.DAYS.between(currentRefDate, emp.getStartDate());
            }
            
            if (emp.getEndDate() == null) {
                // Currently employed, no more unemployment until today
                currentRefDate = LocalDate.now().plusDays(1); // Set to future to stop counting
                break;
            } else {
                currentRefDate = emp.getEndDate().plusDays(1);
            }
        }

        // If last employment ended and it's before today
        if (currentRefDate.isBefore(LocalDate.now())) {
            unemploymentDays += ChronoUnit.DAYS.between(currentRefDate, LocalDate.now());
        }

        return unemploymentDays;
    }
}
