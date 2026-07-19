package com.healthcare.service;

import com.healthcare.model.Doctor;
import com.healthcare.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class DataInitService implements CommandLineRunner {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (doctorRepository.count() == 0) {
            initializeDoctors();
        }
    }
    
    private void initializeDoctors() {
        String[][] doctorsData = {
            {"Dr. Smith", "General Medicine", "dr.smith@hospital.com", "+1-555-0101", "Mon-Fri 9AM-5PM", "10 years"},
            {"Dr. Johnson", "Cardiology", "dr.johnson@hospital.com", "+1-555-0102", "Mon-Wed-Fri 8AM-4PM", "15 years"},
            {"Dr. Brown", "Pediatrics", "dr.brown@hospital.com", "+1-555-0103", "Tue-Thu-Sat 10AM-6PM", "8 years"},
            {"Dr. Davis", "Orthopedics", "dr.davis@hospital.com", "+1-555-0104", "Mon-Fri 7AM-3PM", "12 years"},
            {"Dr. Wilson", "Dermatology", "dr.wilson@hospital.com", "+1-555-0105", "Mon-Thu 9AM-5PM", "7 years"},
            {"Dr. Miller", "Neurology", "dr.miller@hospital.com", "+1-555-0106", "Tue-Fri 8AM-4PM", "20 years"},
            {"Dr. Garcia", "Gynecology", "dr.garcia@hospital.com", "+1-555-0107", "Mon-Wed-Fri 9AM-5PM", "14 years"},
            {"Dr. Martinez", "ENT Specialist", "dr.martinez@hospital.com", "+1-555-0108", "Mon-Sat 8AM-2PM", "9 years"},
            {"Dr. Anderson", "Psychiatry", "dr.anderson@hospital.com", "+1-555-0109", "Tue-Thu 10AM-6PM", "11 years"},
            {"Dr. Taylor", "Ophthalmology", "dr.taylor@hospital.com", "+1-555-0110", "Mon-Fri 9AM-4PM", "13 years"}
        };
        
        for (String[] data : doctorsData) {
            Doctor doctor = new Doctor();
            doctor.setName(data[0]);
            doctor.setSpecialty(data[1]);
            doctor.setEmail(data[2]);
            doctor.setPhone(data[3]);
            doctor.setAvailability(data[4]);
            doctor.setExperience(data[5]);
            doctorRepository.save(doctor);
        }
    }
}