package ru.herooo.mylanguageweb.dto.other.request.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntityCodeRequestDTO {
    @JsonProperty("code")
    private String code;

    @JsonProperty("auth_key")
    private String authKey;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
