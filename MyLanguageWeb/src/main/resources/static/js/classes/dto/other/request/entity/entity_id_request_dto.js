export class EntityIdRequestDTO {
    #id;

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }
}