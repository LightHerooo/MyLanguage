export class CustomerEditRequestDTO {
    #nickname;
    #countryCode;
    #description;

    getNickname() {
        return this.#nickname;
    }

    setNickname(nickname) {
        this.#nickname = nickname;
    }

    getCountryCode() {
        return this.#countryCode;
    }

    setCountryCode(countryCode) {
        this.#countryCode = countryCode;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }
}