package ru.herooo.mylanguageweb.dto.other;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.Date;

public class LocalDateResponse {
    @JsonProperty("value")
    private LocalDate value;

    public LocalDateResponse(LocalDate value) {
        this.value = value;
    }

    public LocalDate getValue() {
        return value;
    }

    public void setValue(LocalDate value) {
        this.value = value;
    }
}
