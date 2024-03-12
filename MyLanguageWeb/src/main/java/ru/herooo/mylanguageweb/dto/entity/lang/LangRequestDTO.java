package ru.herooo.mylanguageweb.dto.entity.lang;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class LangRequestDTO {
    @JsonProperty("code")
    private String code;

    @JsonProperty("is_active_for_in")
    private boolean isActiveForIn;

    @JsonProperty("is_active_for_out")
    private boolean isActiveForOut;

    @JsonProperty("auth_code")
    private String authCode;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean getIsActiveForIn() {
        return isActiveForIn;
    }

    public void setIsActiveForIn(boolean activeForIn) {
        isActiveForIn = activeForIn;
    }

    public boolean getIsActiveForOut() {
        return isActiveForOut;
    }

    public void setIsActiveForOut(boolean activeForOut) {
        isActiveForOut = activeForOut;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }
}
