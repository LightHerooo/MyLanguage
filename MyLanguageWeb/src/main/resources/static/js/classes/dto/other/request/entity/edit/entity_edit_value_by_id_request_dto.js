import {
    BigIntUtils
} from "../../../../../utils/bigint_utils.js";

const _BIGINT_UTILS = new BigIntUtils();

export class EntityEditValueByIdRequestDTO {
    #id;
    #value;

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = _BIGINT_UTILS.parse(id);
    }

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#value = value;
    }
}