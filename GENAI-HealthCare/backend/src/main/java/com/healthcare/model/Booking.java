package com.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String patientName;
    
    @Column(nullable = false)
    private String doctorName;
    
    @Column(nullable = false)
    private String specialty;
    
    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;
    
    private String symptoms;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}