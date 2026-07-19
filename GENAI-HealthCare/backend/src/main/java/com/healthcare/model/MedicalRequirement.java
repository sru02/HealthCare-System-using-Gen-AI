package com.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_requirements")
public class MedicalRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String patientName;
    
    @Column(nullable = false)
    private String requirementType;
    
    @Column(nullable = false, length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String priority;
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime dueDate;

    public MedicalRequirement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getRequirementType() { return requirementType; }
    public void setRequirementType(String requirementType) { this.requirementType = requirementType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}