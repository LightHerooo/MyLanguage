export class EntityEditValueByCodeRequestDTO {
    #code;
    #value;

    getCode() {
        return this.#code;
    }

    setCode(code) {
        this.#code = code;
    }

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }
}