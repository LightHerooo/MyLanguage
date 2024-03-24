import {
    CssMain
} from "../css/css_main.js";

import {
    ImageSources
} from "../image_sources.js";

import {
    AButtonImgSizes
} from "./a_button_img_sizes.js";

const _CSS_MAIN = new CssMain();
const _IMAGE_SOURCES = new ImageSources();

export class AButtons {
    A_BUTTON_DISABLED = new AButtonDisabled();
    A_BUTTON_ACCEPT = new AButtonAccept();
    A_BUTTON_ADD = new AButtonAdd();

    A_BUTTON_DENY = new AButtonDeny();
    A_BUTTON_INFO = new AButtonInfo();
    A_BUTTON_DENY_DOUBLE_CLICK = new AButtonDenyDoubleClick();
    A_BUTTON_ARROW_DOWN = new AButtonArrowDown();
    A_BUTTON_ARROW_UP = new AButtonArrowUp();
    A_BUTTON_ARROW_RIGHT = new AButtonArrowRight();

    callClickEvent(aButtonElement) {
        if (aButtonElement) {
            let event = new Event('click');
            aButtonElement.dispatchEvent(event);
        }
    }
}

class GeneralFunctions {
    #calculateMultiply(aButtonImgSize) {
        let multiply = 1;

        let aButtonImgSizes = new AButtonImgSizes();
        switch (aButtonImgSize.SIZE) {
            case aButtonImgSizes.SIZE_16.SIZE: multiply = 1; break;
            case aButtonImgSizes.SIZE_32.SIZE: multiply = 2; break;
            case aButtonImgSizes.SIZE_64.SIZE: multiply = 3; break;
        }

        return multiply;
    }

    calculatePadding(aButtonImgSize) {
        let multiply = this.#calculateMultiply(aButtonImgSize);
        return `${3 * multiply}px`;
    }
}

class AButtonDisabled {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        let oldPadding = aBtnElement.style.padding;
        if (!oldPadding) {
            oldPadding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);
        }

        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);
        aBtnElement.style.padding = oldPadding;
    }
}

class AButtonAccept {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ACCEPT;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonAdd {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ADD;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonDeny {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.DELETE;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonDenyDoubleClick {
    createA(aButtonImgSize, afterDoubleClickFunction) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize, afterDoubleClickFunction);
        return aBtn;
    }

    setStyles(aButtonElement, aButtonImgSize, afterDoubleClickFunction) {
        const GENERAL_FUNCTIONS = new GeneralFunctions();
        const A_BUTTON_DENY = new AButtonDeny();

        A_BUTTON_DENY.setStyles(aButtonElement, aButtonImgSize);
        aButtonElement.onclick = function() {
            // Устанавливаем новый стиль ---
            this.className = "";
            this.style.cssText = null;
            this.classList.add(_CSS_MAIN.A_BUTTON_WARNING_STANDARD_STYLE_ID);
            this.style.padding = GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

            let img = document.createElement("img");
            img.src = _IMAGE_SOURCES.OTHER.QUESTION;
            img.width = aButtonImgSize.SIZE;
            img.height = aButtonImgSize.SIZE;

            this.replaceChildren();
            this.appendChild(img);
            //---

            this.title = "Нажмите на кнопку ещё раз, чтобы подтвердить удаление";
            this.onclick = function() {
                A_BUTTON_DENY.setStyles(aButtonElement, aButtonImgSize);
                afterDoubleClickFunction();
            }
        }
    }
}

class AButtonArrowDown {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_DOWN;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonArrowUp {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_UP;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonArrowRight {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_RIGHT;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonInfo {
    #GENERAL_FUNCTIONS = new GeneralFunctions();

    createA(aButtonImgSize) {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, aButtonImgSize);
        return aBtn;
    }

    setStyles(aBtnElement, aButtonImgSize) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_INFO_STANDARD_STYLE_ID);
        aBtnElement.style.padding = this.#GENERAL_FUNCTIONS.calculatePadding(aButtonImgSize);

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.INFO;
        img.width = aButtonImgSize.SIZE;
        img.height = aButtonImgSize.SIZE;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}