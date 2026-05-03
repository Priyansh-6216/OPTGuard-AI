package com.optguard.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "deadlines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Deadline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private String title;
    private String deadlineType; // FILING, REPORTING, VALIDATION, etc.
    private LocalDate deadlineDate;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    private String description;

    public enum Status {
        PENDING, COMPLETED, OVERDUE
    }

    public enum RiskLevel {
        GREEN, YELLOW, RED
    }
}
