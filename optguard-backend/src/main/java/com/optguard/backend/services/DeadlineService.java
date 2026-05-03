package com.optguard.backend.services;

import com.optguard.backend.models.*;
import com.optguard.backend.repositories.DeadlineRepository;
import com.optguard.backend.repositories.OptDetailsRepository;
import com.optguard.backend.repositories.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeadlineService {

    private final DeadlineRepository deadlineRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final OptDetailsRepository optDetailsRepository;

    @Transactional
    public void generateDeadlinesForUser(User user) {
        // Clear existing PENDING deadlines
        List<Deadline> existing = deadlineRepository.findByUserOrderByDeadlineDateAsc(user);
        deadlineRepository.deleteAll(existing.stream().filter(d -> d.getStatus() == Deadline.Status.PENDING).toList());

        StudentProfile profile = studentProfileRepository.findById(user.getId()).orElse(null);
        OptDetails optDetails = optDetailsRepository.findByUser(user).orElse(null);

        if (profile == null) return;

        List<Deadline> newDeadlines = new ArrayList<>();

        // 1. OPT Filing Window (based on Program End Date)
        if (profile.getProgramEndDate() != null) {
            newDeadlines.add(Deadline.builder()
                    .user(user)
                    .title("OPT Filing Opens")
                    .deadlineType("FILING")
                    .deadlineDate(profile.getProgramEndDate().minusDays(90))
                    .status(Deadline.Status.PENDING)
                    .riskLevel(Deadline.RiskLevel.GREEN)
                    .description("You can start filing your Form I-765 for Post-Completion OPT.")
                    .build());

            newDeadlines.add(Deadline.builder()
                    .user(user)
                    .title("OPT Filing Closes")
                    .deadlineType("FILING")
                    .deadlineDate(profile.getProgramEndDate().plusDays(60))
                    .status(Deadline.Status.PENDING)
                    .riskLevel(Deadline.RiskLevel.RED)
                    .description("Final day to file for Post-Completion OPT. Must be received by USCIS.")
                    .build());
        }

        // 2. STEM OPT Filing Window (based on EAD End Date)
        if (optDetails != null && optDetails.getEadEndDate() != null) {
            newDeadlines.add(Deadline.builder()
                    .user(user)
                    .title("STEM OPT Filing Opens")
                    .deadlineType("FILING")
                    .deadlineDate(optDetails.getEadEndDate().minusDays(90))
                    .status(Deadline.Status.PENDING)
                    .riskLevel(Deadline.RiskLevel.GREEN)
                    .description("Window to apply for 24-month STEM OPT extension opens.")
                    .build());

            newDeadlines.add(Deadline.builder()
                    .user(user)
                    .title("STEM OPT Filing Closes")
                    .deadlineType("FILING")
                    .deadlineDate(optDetails.getEadEndDate())
                    .status(Deadline.Status.PENDING)
                    .riskLevel(Deadline.RiskLevel.RED)
                    .description("Last day to file for STEM OPT extension.")
                    .build());
        }

        // 3. STEM Validation (based on STEM Start Date)
        if (optDetails != null && optDetails.getStemOptStartDate() != null) {
            LocalDate stemStart = optDetails.getStemOptStartDate();
            int[] months = {6, 12, 18, 24};
            for (int m : months) {
                newDeadlines.add(Deadline.builder()
                        .user(user)
                        .title("STEM " + m + "-Month Validation")
                        .deadlineType("VALIDATION")
                        .deadlineDate(stemStart.plusMonths(m))
                        .status(Deadline.Status.PENDING)
                        .riskLevel(Deadline.RiskLevel.YELLOW)
                        .description("Periodic reporting requirement to your DSO to confirm SEVIS information.")
                        .build());
            }
        }

        deadlineRepository.saveAll(newDeadlines);
    }
}
