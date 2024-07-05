package ru.herooo.mylanguageweb.dto.entity.customer.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class CustomerAddRequestDTO {
    @NotBlank(message = "Никнейм не может быть пустым")
    @Size(min = 3, max = 30, message = "Длина никнейма должен быть от 3-х до 30-ти символов")
    @JsonProperty("nickname")
    private String nickname;

    @NotBlank(message = "Электронная почта не может быть пустой")
    @Email(message = "Некорректная электронная почта")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "Логин не может быть пустым")
    @Size(min = 3, max = 15, message = "Длина логина должен быть от 3-х до 15-ти символов")
    @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Логин должен содержать только английские буквы и цифры")
    @JsonProperty("login")
    private String login;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 8, message = "Минимальная длина пароля - 8 символов")
    @Pattern.List({
        @Pattern(regexp = "^.*[0-9]+.*$", message = "Пароль должен содержать хотя бы одну цифру"),
        @Pattern(regexp = "^.*[%$?~#]+.*$",
                message = "Пароль должен содержать хотя бы один специальный символ (%, $, ?, ~, #)")
    })
    @JsonProperty("password")
    private String password;

    @NotBlank(message = "Выберите страну")
    @JsonProperty("country_code")
    private String countryCode;

    @JsonProperty("auth_key")
    private String authKey;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
