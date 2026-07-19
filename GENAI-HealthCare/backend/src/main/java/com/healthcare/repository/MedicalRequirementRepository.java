package com.healthcare.repository;

import com.healthcare.model.MedicalRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRequirementRepository extends JpaRepository<MedicalRequirement, Long> {
    List<MedicalRequirement> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}