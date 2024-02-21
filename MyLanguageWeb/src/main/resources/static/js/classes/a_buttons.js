import {
    CssMain
} from "./css/css_main.js";

import {
    ImageSources
} from "./image_sources.js";

const _CSS_MAIN = new CssMain();
const _IMAGE_SOURCES = new ImageSources();

export class AButtons {
    A_BUTTON_DISABLED = new AButtonDisabled();
    A_BUTTON_DEFAULT = new AButtonDefault();
    A_BUTTON_ACCEPT = new AButtonAccept();
    A_BUTTON_DENY = new AButtonDeny();
    A_BUTTON_ARROW_DOWN = new AButtonArrowDown();
    A_BUTTON_ARROW_UP = new AButtonArrowUp();
    A_BUTTON_ARROW_RIGHT = new AButtonArrowRight();
}

class AButtonDisabled {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn);
        return aBtn;
    }

    setStyles(aBtnElement) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);
        aBtnElement.style.padding = "3px";
    }
}

class AButtonDefault {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, true);
        return aBtn;
    }

    setStyles(aBtnElement) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
    }
}

class AButtonAccept {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, true);
        return aBtn;
    }

    setStyles(aBtnElement, doRemoveChildren) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);

        if (doRemoveChildren) {
            aBtnElement.style.padding = "3px";

            let img = document.createElement("img");
            img.src = _IMAGE_SOURCES.OTHER.ADD;
            img.width = 16;
            img.height = 16;

            aBtnElement.replaceChildren();
            aBtnElement.appendChild(img);
        }
    }
}

class AButtonDeny {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn, true);
        return aBtn;
    }

    setStyles(aBtnElement, doRemoveChildren) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);

        if (doRemoveChildren) {
            aBtnElement.style.padding = "3px";

            let img = document.createElement("img");
            img.src = _IMAGE_SOURCES.OTHER.DELETE;
            img.width = 16;
            img.height = 16;

            aBtnElement.replaceChildren();
            aBtnElement.appendChild(img);
        }
    }
}

class AButtonArrowDown {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn);
        return aBtn;
    }

    setStyles(aBtnElement) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = "3px";

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_DOWN;
        img.width = 16;
        img.height = 16;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonArrowUp {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn);
        return aBtn;
    }

    setStyles(aBtnElement) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);
        aBtnElement.style.padding = "3px";

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_UP;
        img.width = 16;
        img.height = 16;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}

class AButtonArrowRight {
    createA() {
        let aBtn = document.createElement("a");
        this.setStyles(aBtn);
        return aBtn;
    }

    setStyles(aBtnElement) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
        aBtnElement.style.padding = "3px";

        let img = document.createElement("img");
        img.src = _IMAGE_SOURCES.OTHER.ARROW_RIGHT;
        img.width = 16;
        img.height = 16;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}