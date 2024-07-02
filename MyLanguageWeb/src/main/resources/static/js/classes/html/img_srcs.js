const _PATH_TO_IMAGES_FOLDER = "/images";

export class ImgSrcs {
    OTHER = new OtherFolder();
    BUTTONS = new ButtonsFolder();
}

class ButtonsFolder {
    #PATH_TO_FOLDER = _PATH_TO_IMAGES_FOLDER + "/buttons";

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
}

class OtherFolder {
    #PATH_TO_FOLDER = _PATH_TO_IMAGES_FOLDER + "/other";

    FLAME = `${this.#PATH_TO_FOLDER}/flame.png`;
    HISTORY = `${this.#PATH_TO_FOLDER}/history.png`;
    LOADING = `${this.#PATH_TO_FOLDER}/loading.gif`;
    BOOKS = `${this.#PATH_TO_FOLDER}/books.png`;
    ACCEPT = `${this.#PATH_TO_FOLDER}/accept.png`;
    DENY = `${this.#PATH_TO_FOLDER}/deny.png`;
    EMPTY  = `${this.#PATH_TO_FOLDER}/empty.svg`;
    QUESTION  = `${this.#PATH_TO_FOLDER}/question.png`;
}