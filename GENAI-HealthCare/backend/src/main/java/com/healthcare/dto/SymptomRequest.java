package com.healthcare.dto;

public class SymptomRequest {
    private String symptoms;
    private String age;
    private String gender;

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}