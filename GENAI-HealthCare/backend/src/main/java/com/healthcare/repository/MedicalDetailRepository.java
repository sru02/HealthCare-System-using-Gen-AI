package com.healthcare.repository;

import com.healthcare.model.MedicalDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalDetailRepository extends JpaRepository<MedicalDetail, Long> {
    List<MedicalDetail> findByPatientEmailOrderByCreatedAtDesc(String patientEmail);
    List<MedicalDetail> findByPatientNameContainingIgnoreCase(String patientName);
}