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

    public String generateIcsContent(User user) {
        List<Deadline> deadlines = deadlineRepository.findByUserOrderByDeadlineDateAsc(user);
        StringBuilder sb = new StringBuilder();
        sb.append("BEGIN:VCALENDAR\r\n");
        sb.append("VERSION:2.0\r\n");
        sb.append("PRODID:-//OPTGuard//Compliance Calendar//EN\r\n");
        sb.append("CALSCALE:GREGORIAN\r\n");
        sb.append("METHOD:PUBLISH\r\n");
        sb.append("X-WR-CALNAME:OPTGuard Compliance\r\n");

        String now = java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").format(java.time.Instant.now().atZone(java.time.ZoneId.of("UTC")));

        for (Deadline deadline : deadlines) {
            sb.append("BEGIN:VEVENT\r\n");
            sb.append("UID:").append(deadline.getId()).append("-").append(user.getId()).append("@optguard.ai\r\n");
            sb.append("DTSTAMP:").append(now).append("\r\n");
            sb.append("DTSTART;VALUE=DATE:").append(deadline.getDeadlineDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"))).append("\r\n");
            // End date is inclusive for some calendars if not specified, but for all-day events, DTEND should be the day after.
            sb.append("DTEND;VALUE=DATE:").append(deadline.getDeadlineDate().plusDays(1).format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"))).append("\r\n");
            sb.append("SUMMARY:").append(deadline.getTitle()).append("\r\n");
            sb.append("DESCRIPTION:").append(deadline.getDescription()).append("\r\n");
            sb.append("STATUS:CONFIRMED\r\n");
            sb.append("TRANSP:TRANSPARENT\r\n");
            sb.append("END:VEVENT\r\n");
        }

        sb.append("END:VCALENDAR\r\n");
        return sb.toString();
    }
}
