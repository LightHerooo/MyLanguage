package ru.herooo.mylanguageweb.dto.other.request.entity.value;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntityStringRequestDTO {
    @JsonProperty("value")
    private String value;

    @JsonProperty("auth_key")
    private String authKey;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
