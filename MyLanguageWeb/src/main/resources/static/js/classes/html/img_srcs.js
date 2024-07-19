import {
    UrlPath
} from "../url/path/url_path.js";

const _IMAGES_PATH = new UrlPath("/images").createFullPath();

export class ImgSrcs {
    ELEMENTS = new ImgSrcsElements();
    ENTITY = new ImgSrcsEntity();
    OTHER = new ImgSrcsOther();
}

// Элементы ---
class ImgSrcsElements {
    BUTTON = new ImgSrcsButton();
}

class ImgSrcsButton {
    #PATH = `${_IMAGES_PATH}/elements/button`;

    ACCEPT = `${this.#PATH}/accept.png`;
    DENY = `${this.#PATH}/deny.png`;
    ADD = `${this.#PATH}/add.png`;
    DELETE = `${this.#PATH}/delete.png`;
    INFO = `${this.#PATH}/info.png`;
    QUESTION = `${this.#PATH}/question.png`;
    ARROW_UP = `${this.#PATH}/arrow_up.png`;
    ARROW_RIGHT = `${this.#PATH}/arrow_right.png`;
    ARROW_DOWN = `${this.#PATH}/arrow_down.png`;
    REFRESH = `${this.#PATH}/refresh.png`;
    EDIT = `${this.#PATH}/edit.png`;
    WAIT = `${this.#PATH}/wait.png`;
}
//---

// Энтити ---
class ImgSrcsEntity {
    CUSTOMER = new ImgSrcsCustomer();
    CUSTOMER_COLLECTION = new ImgSrcsCustomerCollection();
}

class ImgSrcsCustomer {
    #PATH = `${_IMAGES_PATH}/entity/customer`;

    DEFAULT = `${this.#PATH}/default.png`;
}

class ImgSrcsCustomerCollection {
    #PATH = `${_IMAGES_PATH}/entity/customer_collection`;

    DEFAULT = `${this.#PATH}/default.png`;
}
//---

class ImgSrcsOther {
    #PATH = _IMAGES_PATH + "/other";

    FLAME = `${this.#PATH}/flame.png`;
    BOOKS = `${this.#PATH}/books.png`;
    ACCEPT = `${this.#PATH}/accept.png`;
    DENY = `${this.#PATH}/deny.png`;
    EMPTY  = `${this.#PATH}/empty.svg`;
    QUESTION  = `${this.#PATH}/question.png`;
}