package ru.herooo.mylanguageweb.dto.other.request.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntityAuthKeyRequestDTO {
    @JsonProperty("auth_key")
    private String authKey;

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
