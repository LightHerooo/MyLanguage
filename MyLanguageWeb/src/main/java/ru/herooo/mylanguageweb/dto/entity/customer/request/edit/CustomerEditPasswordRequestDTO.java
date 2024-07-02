package ru.herooo.mylanguageweb.dto.entity.customer.request.edit;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CustomerEditPasswordRequestDTO {
    @JsonProperty("old_password")
    private String oldPassword;

    @NotBlank(message = "Пароль не может быть пустым.")
    @Size(min = 8, message = "Минимальная длина пароля - 8 символов.")
    @Pattern.List({
            @Pattern(regexp = "^.*[0-9]+.*$", message = "Пароль должен содержать хотя бы одну цифру."),
            @Pattern(regexp = "^.*[%$?~#]+.*$",
                    message = "Пароль должен содержать хотя бы один специальный символ (%, $, ?, ~, #).")
    })
    @JsonProperty("new_password")
    private String newPassword;

    @JsonProperty("auth_key")
    private String authKey;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
