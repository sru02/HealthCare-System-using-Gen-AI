package com.healthcare.dto;

public class ReportRequest {
    private String reportText;
    private String patientName;

    public String getReportText() { return reportText; }
    public void setReportText(String reportText) { this.reportText = reportText; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}