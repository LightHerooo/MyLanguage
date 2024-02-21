package ru.herooo.mylanguageweb.dto.entity.customer;

import jakarta.validation.constraints.NotBlank;

public class CustomerEntryRequestDTO {
    @NotBlank(message = "Логин не может быть пустым.")
    private String login;

    private String password;

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
}
