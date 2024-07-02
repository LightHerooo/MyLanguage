package ru.herooo.mylanguageweb.dto.other.request.entity.value;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntityBooleanRequestDTO {
    @JsonProperty("value")
    private boolean value;

    @JsonProperty("auth_key")
    private String authKey;

    public boolean getValue() {
        return value;
    }

    public void setValue(boolean value) {
        this.value = value;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
