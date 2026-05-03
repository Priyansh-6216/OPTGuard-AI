package com.optguard.backend.services;

import com.optguard.backend.models.StudentProfile;
import com.optguard.backend.models.OptDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.builder().build();

    public String generateTimelineExplanation(StudentProfile profile, OptDetails optDetails) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${GROQ_API_KEY:}")) {
            return "Please provide a Groq API key to get personalized AI insights.";
        }

        String prompt = String.format(
            "As an OPT compliance assistant, provide a brief (2-3 sentences), encouraging, and educational explanation of the student's upcoming deadlines. " +
            "Student Info: University: %s, Degree: %s, Program End Date: %s. " +
            "OPT Status: %s. Requested Start Date: %s. EAD End Date: %s. " +
            "Focus on the most immediate next step. Remind them to confirm with their DSO.",
            profile.getUniversityName(), profile.getDegreeLevel(), profile.getProgramEndDate(),
            profile.getOptType(), optDetails.getRequestedOptStartDate(), optDetails.getEadEndDate()
        );

        try {
            Map<String, Object> request = Map.of(
                "model", "llama3-70b-8192",
                "messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful immigration compliance assistant for F1 students. Never give legal advice."),
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
            );

            Map response = restClient.post()
                .uri(apiUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List choices = (List) response.get("choices");
                if (!choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map message = (Map) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            return "Your OPT timeline is ready! Be sure to check your upcoming deadlines and coordinate with your DSO.";
        }

        return "Welcome to OPTGuard! We've generated your compliance timeline based on your program dates.";
    }

    public String chat(String context, String question) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${GROQ_API_KEY:}")) {
            return "Please provide a Groq API key to use the AI Assistant.";
        }

        try {
            Map<String, Object> request = Map.of(
                "model", "llama3-70b-8192",
                "messages", List.of(
                    Map.of("role", "system", "content", 
                        "You are OPTGuard AI, a helpful assistant for F1 students. " +
                        "Provide educational guidance on OPT/STEM OPT rules based on official USCIS/SEVP guidelines. " +
                        "IMPORTANT: Never give legal advice. Always include a disclaimer that the student should confirm with their DSO or a qualified attorney. " +
                        "Use the provided user context to give personalized but general educational info."),
                    Map.of("role", "user", "content", context + "\nQuestion: " + question)
                )
            );

            Map response = restClient.post()
                .uri(apiUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List choices = (List) response.get("choices");
                Map choice = (Map) choices.get(0);
                Map message = (Map) choice.get("message");
                return (String) message.get("content");
            }
        } catch (Exception e) {
            return "I'm having trouble connecting to my brain right now. Please try again later or consult your DSO.";
        }
        return "I'm not sure how to answer that right now. Please check with your DSO.";
    }
}
