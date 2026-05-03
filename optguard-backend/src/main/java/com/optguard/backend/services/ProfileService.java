package com.optguard.backend.services;

import com.optguard.backend.dto.ProfileRequest;
import com.optguard.backend.models.OptDetails;
import com.optguard.backend.models.StudentProfile;
import com.optguard.backend.models.User;
import com.optguard.backend.repositories.OptDetailsRepository;
import com.optguard.backend.repositories.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final OptDetailsRepository optDetailsRepository;
    private final DeadlineService deadlineService;
    private final AiService aiService;

    @Transactional
    public void createOrUpdateProfile(User user, ProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findById(user.getId())
                .orElse(StudentProfile.builder().user(user).build());

        profile.setFullName(request.getFullName());
        profile.setUniversityName(request.getUniversityName());
        profile.setSevisId(request.getSevisId());
        profile.setDegreeLevel(request.getDegreeLevel());
        profile.setProgramStartDate(request.getProgramStartDate());
        profile.setProgramEndDate(request.getProgramEndDate());
        profile.setOptType(request.getOptType());

        studentProfileRepository.save(profile);

        OptDetails optDetails = optDetailsRepository.findByUser(user)
                .orElse(OptDetails.builder().user(user).build());

        optDetails.setOptI20IssueDate(request.getOptI20IssueDate());
        optDetails.setRequestedOptStartDate(request.getRequestedOptStartDate());
        optDetails.setEadStartDate(request.getEadStartDate());
        optDetails.setEadEndDate(request.getEadEndDate());
        optDetails.setStemOptStartDate(request.getStemOptStartDate());

        optDetailsRepository.save(optDetails);

        // Generate AI explanation
        String explanation = aiService.generateTimelineExplanation(profile, optDetails);
        profile.setAiExplanation(explanation);
        studentProfileRepository.save(profile);

        // Regenerate deadlines after profile update
        deadlineService.generateDeadlinesForUser(user);
    }
}
