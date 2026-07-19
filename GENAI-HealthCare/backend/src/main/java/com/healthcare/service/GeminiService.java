package com.healthcare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {
    
    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}")
    private String apiUrl;
    
    @Value("${gemini.api.key:AIzaSyDfpMgv0mkehMZNwUplBQC4XcVp35J8Zyw}")
    private String apiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = apiUrl + "?key=" + apiKey;
            
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(url, entity, (Class<Map<String, Object>>) (Class<?>) Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Unable to generate response";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}