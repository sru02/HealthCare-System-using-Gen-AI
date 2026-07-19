package com.healthcare.controller;

import com.healthcare.dto.*;
import com.healthcare.service.HealthcareService;
import com.healthcare.service.EmailService;
import com.healthcare.service.RAGService;
import com.healthcare.model.*;
import com.healthcare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class HealthcareController {
    
    @Autowired
    private HealthcareService healthcareService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RAGService ragService;

    @Autowired
    private MedicalRequirementRepository medicalRequirementRepository;

    @PostMapping("/symptoms")
    public ApiResponse analyzeSymptoms(@RequestBody SymptomRequest request) {
        return healthcareService.analyzeSymptoms(request);
    }

    @PostMapping("/mental-health")
    public ApiResponse mentalHealthChat(@RequestBody ChatRequest request) {
        return healthcareService.mentalHealthChat(request);
    }

    @PostMapping("/mental-health/session")
    public ApiResponse mentalHealthChatWithHistory(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        String mood = (String) request.get("mood");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");
        return healthcareService.mentalHealthChatWithHistory(message, mood, history);
    }

    @PostMapping("/summarize-report")
    public ApiResponse summarizeReport(@RequestBody ReportRequest request) {
        return healthcareService.summarizeReport(request);
    }

    @PostMapping("/summarize-report-file")
    public ApiResponse summarizeReportFile(@RequestParam("file") MultipartFile file, @RequestParam("patientName") String patientName) {
        return healthcareService.summarizeReportFile(file, patientName);
    }

    @PostMapping("/ask-report")
    public ApiResponse askAboutReport(@RequestBody Map<String, String> request) {
        return healthcareService.askAboutReport(
            request.get("question"),
            request.get("reportContent"),
            request.get("patientName")
        );
    }

    @GetMapping("/report-history/{patientName}")
    public ApiResponse getReportHistory(@PathVariable String patientName) {
        return new ApiResponse("Reports retrieved", true,
            healthcareService.getReportHistory(patientName));
    }

    @PostMapping("/login")
    public ApiResponse login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            // Set admin role for admin email if not already set
            if (email.equals("admin@admin.com") && !"ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
                userRepository.save(user);
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole() != null ? user.getRole() : "USER");
            return new ApiResponse("Login successful", true, userData);
        }
        return new ApiResponse("Invalid credentials", false);
    }

    @PostMapping("/register")
    public ApiResponse register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        
        if (userRepository.findByEmail(email) != null) {
            return new ApiResponse("Email already exists", false);
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);
        if (email.equals("admin@admin.com")) {
            user.setRole("ADMIN");
        }
        userRepository.save(user);
        
        return new ApiResponse("Registration successful", true);
    }

    @PostMapping("/appointments")
    public ApiResponse bookAppointment(@RequestBody Map<String, Object> request) {
        try {
            Booking booking = new Booking();
            booking.setUserEmail((String) request.get("userEmail"));
            booking.setPatientName((String) request.get("patientName"));
            booking.setDoctorName((String) request.get("doctorName"));
            booking.setSpecialty((String) request.get("specialty"));
            booking.setAppointmentDateTime(LocalDateTime.parse((String) request.get("appointmentDateTime")));
            booking.setSymptoms((String) request.get("symptoms"));
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Send email confirmation
            try {
                emailService.sendBookingConfirmation(savedBooking);
            } catch (Exception emailError) {
                System.out.println("Email notification failed, but booking was successful");
            }
            
            return new ApiResponse("Appointment booked successfully!", true);
        } catch (Exception e) {
            return new ApiResponse("Error booking appointment", false);
        }
    }

    @GetMapping("/appointments/{userEmail}")
    public ApiResponse getAppointments(@PathVariable String userEmail) {
        List<Booking> bookings = bookingRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
        return new ApiResponse("Appointments retrieved", true, bookings);
    }

    @PutMapping("/appointments/{id}")
    public ApiResponse updateAppointment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking == null) {
                return new ApiResponse("Appointment not found", false);
            }
            
            booking.setPatientName((String) request.get("patientName"));
            booking.setDoctorName((String) request.get("doctorName"));
            booking.setSpecialty((String) request.get("specialty"));
            booking.setAppointmentDateTime(LocalDateTime.parse((String) request.get("appointmentDateTime")));
            booking.setSymptoms((String) request.get("symptoms"));
            
            bookingRepository.save(booking);
            return new ApiResponse("Appointment updated successfully!", true);
        } catch (Exception e) {
            return new ApiResponse("Error updating appointment", false);
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ApiResponse cancelAppointment(@PathVariable Long id) {
        try {
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return new ApiResponse("Appointment cancelled successfully!", true);
            }
            return new ApiResponse("Appointment not found", false);
        } catch (Exception e) {
            return new ApiResponse("Error cancelling appointment", false);
        }
    }

    @RequestMapping(value = "/appointments/{id}", method = RequestMethod.OPTIONS)
    public ApiResponse optionsAppointment(@PathVariable Long id) {
        return new ApiResponse("OK", true);
    }

    @PostMapping("/medical-requirements")
    public ApiResponse createMedicalRequirement(@RequestBody Map<String, Object> request) {
        try {
            MedicalRequirement requirement = new MedicalRequirement();
            requirement.setUserEmail((String) request.get("userEmail"));
            requirement.setPatientName((String) request.get("patientName"));
            requirement.setRequirementType((String) request.get("requirementType"));
            requirement.setDescription((String) request.get("description"));
            requirement.setPriority((String) request.get("priority"));
            
            String dueDateStr = (String) request.get("dueDate");
            if (dueDateStr != null && !dueDateStr.isEmpty()) {
                requirement.setDueDate(LocalDateTime.parse(dueDateStr));
            }
            
            medicalRequirementRepository.save(requirement);
            return new ApiResponse("Medical requirement created successfully!", true);
        } catch (Exception e) {
            return new ApiResponse("Error creating medical requirement", false);
        }
    }

    @GetMapping("/medical-requirements/{userEmail}")
    public ApiResponse getMedicalRequirements(@PathVariable String userEmail) {
        List<MedicalRequirement> requirements = medicalRequirementRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
        return new ApiResponse("Requirements retrieved", true, requirements);
    }

    // RAG endpoints
    @PostMapping("/rag/upload")
    public ApiResponse uploadKnowledgeDocument(@RequestBody Map<String, String> request) {
        try {
            KnowledgeDocument doc = ragService.storeDocument(
                request.get("title"),
                request.get("category"),
                request.get("content"),
                request.get("uploadedBy")
            );
            return new ApiResponse("Document uploaded and chunked successfully! ID: " + doc.getId(), true);
        } catch (Exception e) {
            return new ApiResponse("Error uploading document: " + e.getMessage(), false);
        }
    }

    @PostMapping("/rag/query")
    public ApiResponse ragQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String response = ragService.ragQuery(query);
        return new ApiResponse(response, true);
    }

    @GetMapping("/rag/documents")
    public ApiResponse getAllDocuments() {
        return new ApiResponse("Documents retrieved", true, ragService.getAllDocuments());
    }

    @DeleteMapping("/rag/documents/{id}")
    public ApiResponse deleteDocument(@PathVariable Long id) {
        ragService.deleteDocument(id);
        return new ApiResponse("Document deleted", true);
    }

    @GetMapping("/admin/bookings")
    public ApiResponse getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return new ApiResponse("All bookings retrieved", true, bookings);
    }

    @GetMapping("/admin/users")
    public ApiResponse getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ApiResponse("All users retrieved", true, users);
    }

    @GetMapping("/admin/requirements")
    public ApiResponse getAllRequirements() {
        List<MedicalRequirement> requirements = medicalRequirementRepository.findAll();
        return new ApiResponse("All requirements retrieved", true, requirements);
    }

    @DeleteMapping("/admin/bookings/{id}")
    public ApiResponse adminCancelBooking(@PathVariable Long id) {
        try {
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return new ApiResponse("Booking cancelled by admin", true);
            }
            return new ApiResponse("Booking not found", false);
        } catch (Exception e) {
            return new ApiResponse("Error cancelling booking", false);
        }
    }

    @GetMapping("/admin/doctors")
    public ApiResponse getAllDoctors() {
        // Return mock doctors data for now
        List<Map<String, Object>> doctors = new ArrayList<>();
        Map<String, Object> doctor1 = new HashMap<>();
        doctor1.put("id", 1L);
        doctor1.put("name", "Dr. Smith");
        doctor1.put("specialty", "General Medicine");
        doctor1.put("email", "dr.smith@hospital.com");
        doctor1.put("phone", "+1-555-0101");
        doctor1.put("availability", "Mon-Fri 9AM-5PM");
        doctor1.put("experience", "10 years");
        doctors.add(doctor1);
        
        Map<String, Object> doctor2 = new HashMap<>();
        doctor2.put("id", 2L);
        doctor2.put("name", "Dr. Johnson");
        doctor2.put("specialty", "Cardiology");
        doctor2.put("email", "dr.johnson@hospital.com");
        doctor2.put("phone", "+1-555-0102");
        doctor2.put("availability", "Mon-Wed 10AM-6PM");
        doctor2.put("experience", "15 years");
        doctors.add(doctor2);
        
        return new ApiResponse("All doctors retrieved", true, doctors);
    }

    @PostMapping("/admin/doctors")
    public ApiResponse addDoctor(@RequestBody Map<String, String> request) {
        // Mock implementation - in real app, save to database
        return new ApiResponse("Doctor added successfully", true);
    }

    @DeleteMapping("/admin/doctors/{id}")
    public ApiResponse removeDoctor(@PathVariable Long id) {
        // Mock implementation - in real app, delete from database
        return new ApiResponse("Doctor removed successfully", true);
    }

    @GetMapping("/admin/patients")
    public ApiResponse getAllPatients() {
        List<User> patients = userRepository.findAll();
        return new ApiResponse("All patients retrieved", true, patients);
    }

    @PutMapping("/admin/requirements/{id}/issue")
    public ApiResponse markRequirementAsIssued(@PathVariable Long id) {
        try {
            MedicalRequirement requirement = medicalRequirementRepository.findById(id).orElse(null);
            if (requirement == null) {
                return new ApiResponse("Requirement not found", false);
            }
            requirement.setStatus("ISSUED");
            medicalRequirementRepository.save(requirement);
            return new ApiResponse("Requirement marked as issued", true);
        } catch (Exception e) {
            return new ApiResponse("Error updating requirement", false);
        }
    }
}