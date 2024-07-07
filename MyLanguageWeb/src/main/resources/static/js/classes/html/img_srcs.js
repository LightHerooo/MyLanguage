const _MAIN_PATH_TO_FOLDER = "/images";

export class ImgSrcs {
    ELEMENTS = new ImgSrcsElements();
    OTHER = new OtherFolder();
}

// Элементы ---
class ImgSrcsElements {
    BUTTON = new ImgSrcsButton();
}

class ImgSrcsButton {
    #PATH_TO_FOLDER = `${_MAIN_PATH_TO_FOLDER}/elements/button`;

    ACCEPT = `${this.#PATH_TO_FOLDER}/accept.png`;
    DENY = `${this.#PATH_TO_FOLDER}/deny.png`;
    ADD = `${this.#PATH_TO_FOLDER}/add.png`;
    DELETE = `${this.#PATH_TO_FOLDER}/delete.png`;
    INFO = `${this.#PATH_TO_FOLDER}/info.png`;
    QUESTION = `${this.#PATH_TO_FOLDER}/question.png`;
    ARROW_UP = `${this.#PATH_TO_FOLDER}/arrow_up.png`;
    ARROW_RIGHT = `${this.#PATH_TO_FOLDER}/arrow_right.png`;
    ARROW_DOWN = `${this.#PATH_TO_FOLDER}/arrow_down.png`;
    REFRESH = `${this.#PATH_TO_FOLDER}/refresh.png`;
    EDIT = `${this.#PATH_TO_FOLDER}/edit.png`;
    WAIT = `${this.#PATH_TO_FOLDER}/wait.png`;
}
//---

class OtherFolder {
    #PATH_TO_FOLDER = _MAIN_PATH_TO_FOLDER + "/other";

    FLAME = `${this.#PATH_TO_FOLDER}/flame.png`;
    BOOKS = `${this.#PATH_TO_FOLDER}/books.png`;
    ACCEPT = `${this.#PATH_TO_FOLDER}/accept.png`;
    DENY = `${this.#PATH_TO_FOLDER}/deny.png`;
    EMPTY  = `${this.#PATH_TO_FOLDER}/empty.svg`;
    QUESTION  = `${this.#PATH_TO_FOLDER}/question.png`;
}