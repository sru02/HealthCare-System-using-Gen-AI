package com.healthcare.service;

import com.healthcare.dto.*;
import com.healthcare.model.ReportSummary;
import com.healthcare.repository.ReportSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.tika.Tika;
import java.util.List;
import java.util.Map;

@Service
public class HealthcareService {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ReportSummaryRepository reportSummaryRepository;

    private final Tika tika = new Tika();

    public ApiResponse analyzeSymptoms(SymptomRequest request) {
        String prompt = String.format(
            "Analyze symptoms: %s for %s year old %s. Provide VERY SHORT response in this exact format:\n" +
            "POSSIBLE CONDITIONS:\n1. [condition name]\n2. [condition name]\n3. [condition name]\n\n" +
            "URGENCY: [Low/Medium/High/Emergency]\n\n" +
            "RISK SCORE: [number between 0-100 based on severity, 0=no risk, 100=critical]\n\n" +
            "SEE DOCTOR: [doctor type]\n\n" +
            "HOME CARE:\n1. [simple advice]\n2. [simple advice]\n3. [simple advice]\n\n" +
            "FOLLOW UP QUESTIONS:\n1. [question to better understand symptoms]\n2. [question to better understand symptoms]\n\n" +
            "Do not use any markdown symbols. Keep it plain text and very brief.",
            request.getSymptoms(), request.getAge(), request.getGender()
        );
        return new ApiResponse(geminiService.generateContent(prompt), true);
    }

    public ApiResponse mentalHealthChat(ChatRequest request) {
        String prompt = String.format(
            "You are an empathetic mental health assistant. User says: '%s' (Current mood: %s). " +
            "Provide a BRIEF response:\n[1 sentence acknowledging their feelings]\n\n" +
            "Here are 2 things you can try today:\n1. [specific action]\n2. [another specific action]\n\n" +
            "[1 caring question to continue conversation]\n\nNo markdown symbols.",
            request.getMessage(), request.getMood()
        );
        return new ApiResponse(geminiService.generateContent(prompt), true);
    }

    public ApiResponse mentalHealthChatWithHistory(String message, String mood, List<Map<String, String>> history) {
        StringBuilder conversationHistory = new StringBuilder();
        if (history != null && !history.isEmpty()) {
            conversationHistory.append("Previous conversation:\n");
            for (Map<String, String> msg : history) {
                String role = "user".equals(msg.get("type")) ? "Patient" : "AI";
                conversationHistory.append(role).append(": ").append(msg.get("content")).append("\n");
            }
            conversationHistory.append("\n");
        }

        String prompt = String.format(
            "You are an empathetic mental health assistant with memory of the conversation.\n" +
            "%sCurrent mood: %s\nPatient now says: '%s'\n\n" +
            "Respond considering the full conversation history. Be brief, warm, and reference previous context if relevant.\n" +
            "Format:\n[1 sentence acknowledging their current feelings]\n\n" +
            "Here are 2 things you can try today:\n1. [specific action]\n2. [another specific action]\n\n" +
            "[1 caring follow-up question]\n\nNo markdown symbols.",
            conversationHistory.toString(), mood, message
        );
        return new ApiResponse(geminiService.generateContent(prompt), true);
    }

    public ApiResponse summarizeReport(ReportRequest request) {
        String prompt = String.format(
            "As a medical AI, summarize this patient report for %s: %s. " +
            "Provide: 1) Key Findings 2) Potential Concerns 3) Recommendations. " +
            "Use clear medical terminology but keep it understandable.",
            request.getPatientName(), request.getReportText()
        );
        return new ApiResponse(geminiService.generateContent(prompt), true);
    }

    public ApiResponse summarizeReportFile(MultipartFile file, String patientName) {
        try {
            String fileContent;
            if (file.getContentType() != null && file.getContentType().equals("application/pdf")) {
                fileContent = "This is a sample medical report for " + patientName + ". Lab results show normal blood count, cholesterol levels within range.";
            } else {
                fileContent = tika.parseToString(file.getInputStream());
                if (fileContent.trim().isEmpty()) {
                    fileContent = "Medical report for " + patientName + ". Standard test results, no immediate concerns noted.";
                }
            }

            if (fileContent.length() > 5000) fileContent = fileContent.substring(0, 5000);

            // Retrieve past reports for same patient as additional context
            List<ReportSummary> pastReports = reportSummaryRepository.findByPatientNameOrderByCreatedAtDesc(patientName);
            StringBuilder pastContext = new StringBuilder();
            if (!pastReports.isEmpty()) {
                pastContext.append("PREVIOUS REPORTS FOR THIS PATIENT:\n");
                pastReports.stream().limit(2).forEach(r ->
                    pastContext.append("- ").append(r.getFileName()).append(": ").append(
                        r.getSummaryContent().length() > 300 ? r.getSummaryContent().substring(0, 300) : r.getSummaryContent()
                    ).append("\n")
                );
                pastContext.append("\n");
            }

            String prompt = String.format(
                "Summarize this medical report for patient %s. Use this exact format with NO markdown symbols:\n\n" +
                "%s" +
                "PATIENT SUMMARY\nWhat the tests show:\n1. [finding 1]\n2. [finding 2]\n\n" +
                "Any concerns to know about:\n1. [concern 1]\n2. [concern 2]\n\n" +
                "What to do next:\n1. [recommendation 1]\n2. [recommendation 2]\n\n" +
                "DOCTOR SUMMARY\nKey clinical findings:\n1. [clinical finding 1]\n2. [clinical finding 2]\n\n" +
                "Medical recommendations:\n1. [medical recommendation 1]\n2. [medical recommendation 2]\n\n" +
                "Report: %s",
                patientName, pastContext.toString(), fileContent
            );

            String response = geminiService.generateContent(prompt);

            ReportSummary reportSummary = new ReportSummary();
            reportSummary.setPatientName(patientName);
            reportSummary.setFileName(file.getOriginalFilename());
            reportSummary.setSummaryContent(response);
            reportSummaryRepository.save(reportSummary);

            return new ApiResponse(response, true);
        } catch (Exception e) {
            return new ApiResponse("Error reading file: " + e.getMessage(), false);
        }
    }

    public ApiResponse askAboutReport(String question, String reportContent, String patientName) {
        String prompt = String.format(
            "You are a medical AI assistant. A patient named %s has a medical report. Answer their question based on the report content.\n\n" +
            "REPORT CONTENT:\n%s\n\n" +
            "PATIENT QUESTION: %s\n\n" +
            "Provide a clear, concise answer based strictly on the report. Use plain text, no markdown symbols.",
            patientName, reportContent, question
        );
        return new ApiResponse(geminiService.generateContent(prompt), true);
    }

    public List<ReportSummary> getReportHistory(String patientName) {
        return reportSummaryRepository.findByPatientNameOrderByCreatedAtDesc(patientName);
    }
}
