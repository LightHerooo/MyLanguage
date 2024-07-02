export class EntityValueRequestDTO {
    #value;

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }
}