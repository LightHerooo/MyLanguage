package ru.herooo.mylanguageweb.dto.other.response.value;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IntResponseDTO {
    @JsonProperty("value")
    int value;

    public IntResponseDTO(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
