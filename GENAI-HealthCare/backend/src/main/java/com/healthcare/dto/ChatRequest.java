package com.healthcare.dto;

public class ChatRequest {
    private String message;
    private String mood;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
}