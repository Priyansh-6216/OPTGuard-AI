package com.optguard.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private String employerName;
    private String jobTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String everifyNumber;
    private boolean isCurrent;
}
