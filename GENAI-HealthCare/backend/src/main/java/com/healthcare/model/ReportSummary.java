package com.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_summaries")
public class ReportSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_name")
    private String patientName;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "summary_content", columnDefinition = "TEXT")
    private String summaryContent;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getSummaryContent() { return summaryContent; }
    public void setSummaryContent(String summaryContent) { this.summaryContent = summaryContent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}