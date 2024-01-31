import {
    CssMain
} from "./css/css_main.js";

const _CSS_MAIN = new CssMain();

export class AButtons {
    A_BUTTON_DISABLED = new AButtonDisabled();
    A_BUTTON_DEFAULT = new AButtonDefault();
    A_BUTTON_ACCEPT = new AButtonAccept();
    A_BUTTON_DENY = new AButtonDeny();
    A_BUTTON_ARROW_DOWN = new AButtonArrowDown();
    A_BUTTON_ARROW_UP = new AButtonArrowUp();
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
            img.src = "/images/other/add.png";
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
            img.src = "/images/other/delete.png";
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
        img.src = "/images/other/arrow_down.png";
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
        img.src = "/images/other/arrow_up.png";
        img.width = 16;
        img.height = 16;

        aBtnElement.replaceChildren();
        aBtnElement.appendChild(img);
    }
}