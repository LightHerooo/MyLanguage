package ru.herooo.mylanguageweb.dto.entity.customer.request.edit;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class CustomerEditRequestDTO {
    @NotBlank(message = "Никнейм не может быть пустым.")
    @Size(min = 3, max = 30, message = "Длина никнейма должен быть от 3-х до 30-ти символов.")
    @JsonProperty("nickname")
    private String nickname;

    @NotBlank(message = "Выберите страну.")
    @JsonProperty("country_code")
    private String countryCode;

    @Size(max = 255, message = "Длина описания не должна быть более 255 символов.")
    @JsonProperty("description")
    private String description;

    @JsonProperty("auth_key")
    private String authKey;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
