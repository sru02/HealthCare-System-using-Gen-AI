package com.healthcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.healthcare.model.Booking;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    public void sendBookingConfirmation(Booking booking) {
        try {
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Your appointment has been successfully booked!\n\n" +
                "Appointment Details:\n" +
                "Patient Name: %s\n" +
                "Doctor: %s\n" +
                "Specialty: %s\n" +
                "Date & Time: %s\n" +
                "Symptoms: %s\n\n" +
                "Please arrive 15 minutes before your scheduled appointment.\n\n" +
                "Thank you for choosing our healthcare services.\n\n" +
                "Best regards,\n" +
                "Healthcare System Team",
                booking.getPatientName(),
                booking.getPatientName(),
                booking.getDoctorName(),
                booking.getSpecialty(),
                booking.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                booking.getSymptoms()
            );
            
            // Log email content for testing
            System.out.println("=== EMAIL SENT ===");
            System.out.println("To: " + booking.getUserEmail());
            System.out.println("Subject: Appointment Booking Confirmation - Healthcare System");
            System.out.println("Body: \n" + emailBody);
            System.out.println("==================");
            
            // Try to send actual email, but don't fail if it doesn't work
            if (mailSender != null) {
                try {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(booking.getUserEmail());
                    message.setSubject("Appointment Booking Confirmation - Healthcare System");
                    message.setText(emailBody);
                    message.setFrom("srushtin2123@gmail.com");
                    mailSender.send(message);
                    System.out.println("✅ Email sent successfully to: " + booking.getUserEmail());
                } catch (Exception mailException) {
                    System.out.println("⚠️ Email sending failed: " + mailException.getMessage());
                }
            } else {
                System.out.println("📧 Email service not configured - mailSender is null");
            }
            
        } catch (Exception e) {
            System.err.println("Failed to process email: " + e.getMessage());
        }
    }
}