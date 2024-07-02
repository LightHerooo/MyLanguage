export class CustomerAddRequestDTO {
    #nickname;
    #email;
    #login;
    #password;
    #countryCode;

    getNickname() {
        return this.#nickname;
    }

    setNickname(nickname) {
        this.#nickname = nickname;
    }

    getEmail() {
        return this.#email;
    }

    setEmail(email) {
        this.#email = email;
    }

    getLogin() {
        return this.#login;
    }

    setLogin(login) {
        this.#login = login;
    }

    getPassword() {
        return this.#password;
    }

    setPassword(password) {
        this.#password = password;
    }

    getCountryCode() {
        return this.#countryCode;
    }

    setCountryCode(countryCode) {
        this.#countryCode = countryCode;
    }
}