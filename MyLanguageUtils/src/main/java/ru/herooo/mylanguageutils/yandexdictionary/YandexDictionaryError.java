package ru.herooo.mylanguageutils.yandexdictionary;

import com.fasterxml.jackson.annotation.JsonProperty;

public class YandexDictionaryError {
    @JsonProperty("code")
    int code;

    @JsonProperty("message")
    String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
