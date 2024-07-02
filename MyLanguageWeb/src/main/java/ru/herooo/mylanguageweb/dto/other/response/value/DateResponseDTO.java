package ru.herooo.mylanguageweb.dto.other.response.value;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class DateResponseDTO {
    @JsonProperty("value")
    private LocalDate value;

    public DateResponseDTO(LocalDate value) {
        this.value = value;
    }

    public LocalDate getValue() {
        return value;
    }

    public void setValue(LocalDate value) {
        this.value = value;
    }
}
