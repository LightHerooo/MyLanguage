package ru.herooo.mylanguageweb.dto.other.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResponseMessageResponseDTO {
    @JsonProperty("id")
    private int id;

    @JsonProperty("message")
    private String message;

    public ResponseMessageResponseDTO() {}
    public ResponseMessageResponseDTO(int id, String message) {
        this.id = id;
        this.message = message;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
