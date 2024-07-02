package ru.herooo.mylanguageweb.dto.other.request.entity.edit.b;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntityEditBooleanByCodeRequestDTO {
    @JsonProperty("code")
    private String code;

    @JsonProperty("value")
    private boolean value;

    @JsonProperty("auth_key")
    private String authKey;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

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
