package ru.herooo.mylanguageweb.dto.customer;

import jakarta.validation.constraints.*;

public class CustomerRegValidDTO {

    @NotBlank
    @Size(min = 3, max = 30)
    @Pattern(regexp = "^[^ ]+$")
    private String nickname;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 3, max = 15)
    @Pattern(regexp = "^[A-Za-z0-9_]+$")
    private String login;

    @NotBlank
    @Size(min = 8)
    @Pattern.List({
        @Pattern(regexp = "^.*[0-9]+.*$"),
        @Pattern(regexp = "^.*[%$?~#]+.*$")
    })
    private String password;

    public CustomerRegValidDTO() {}

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
}
