package com.optguard.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileRequest {
    private String fullName;
    private String universityName;
    private String sevisId;
    private String degreeLevel;
    private LocalDate programStartDate;
    private LocalDate programEndDate;
    private String optType;
    
    // OPT Details
    private LocalDate optI20IssueDate;
    private LocalDate requestedOptStartDate;
    private LocalDate eadStartDate;
    private LocalDate eadEndDate;
    private LocalDate stemOptStartDate;
}
