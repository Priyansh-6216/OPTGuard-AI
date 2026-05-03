package com.optguard.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "student_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private String fullName;
    private String universityName;
    private String sevisId;
    private String degreeLevel;
    
    private LocalDate programStartDate;
    private LocalDate programEndDate;
    
    private String optType; // Post-completion OPT or STEM OPT
    
    @Column(columnDefinition = "TEXT")
    private String aiExplanation;
}
