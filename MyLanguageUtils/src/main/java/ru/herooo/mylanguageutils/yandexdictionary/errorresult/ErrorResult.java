package ru.herooo.mylanguageutils.yandexdictionary.errorresult;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErrorResult {
    int code;

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
