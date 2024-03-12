package ru.herooo.mylanguageweb.dto.entity.workouttype;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkoutTypeRequestDTO {
    @JsonProperty("code")
    private String code;

    @JsonProperty("is_active")
    private boolean isActive;

    @JsonProperty("auth_code")
    private String authCode;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean active) {
        isActive = active;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }
}
