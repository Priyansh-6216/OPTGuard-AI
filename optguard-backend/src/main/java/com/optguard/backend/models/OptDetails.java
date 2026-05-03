package com.optguard.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "opt_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private LocalDate optI20IssueDate;
    private LocalDate requestedOptStartDate;
    private LocalDate eadStartDate;
    private LocalDate eadEndDate;
    private LocalDate stemOptStartDate;
    private LocalDate stemOptEndDate;
}
