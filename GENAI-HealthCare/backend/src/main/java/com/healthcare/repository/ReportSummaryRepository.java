package com.healthcare.repository;

import com.healthcare.model.ReportSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportSummaryRepository extends JpaRepository<ReportSummary, Long> {
    List<ReportSummary> findByPatientNameOrderByCreatedAtDesc(String patientName);
}