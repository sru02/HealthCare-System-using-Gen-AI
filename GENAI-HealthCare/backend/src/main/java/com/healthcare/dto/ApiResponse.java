package com.healthcare.dto;

public class ApiResponse {
    private String response;
    private boolean success;
    private Object data;

    public ApiResponse(String response, boolean success) {
        this.response = response;
        this.success = success;
    }

    public ApiResponse(String response, boolean success, Object data) {
        this.response = response;
        this.success = success;
        this.data = data;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}