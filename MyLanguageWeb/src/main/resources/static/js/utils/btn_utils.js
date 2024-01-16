import {
    CssMain
} from "../classes/css/css_main.js";

const _CSS_MAIN = new CssMain();

export function createBtnShowMore(btnShowMoreId, numberOfItemsToShow) {
    // Создаём кнопку тега "а", привязываем класс, чтобы применить стили
    let btnShowMore = document.createElement("a");
    btnShowMore.id = btnShowMoreId;
    btnShowMore.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
    btnShowMore.classList.add(_CSS_MAIN.A_SHOW_MORE_STANDARD_STYLE_ID);
    btnShowMore.text = `Показать ещё ${numberOfItemsToShow} элементов...`;
    btnShowMore.addEventListener("click", function () {
        removeBtnShowMore(btnShowMoreId);
    });

    return btnShowMore;
}

export function removeBtnShowMore(btnShowMoreId) {
    let btnShowMore = document.getElementById(btnShowMoreId);
    if (btnShowMore != null) {
        btnShowMore.parentNode.removeChild(btnShowMore);
    }
}

export function createABtnStandard() {
    let aBtnAccept = document.createElement("a");
    buildABtnStandard(aBtnAccept, true);
    return aBtnAccept;
}

export function createABtnAccept() {
    let aBtnAccept = document.createElement("a");
    buildABtnAccept(aBtnAccept, true);
    return aBtnAccept;
}

export function createABtnDeny() {
    let aBtnDeny = document.createElement("a");
    buildABtnDeny(aBtnDeny, true);
    return aBtnDeny;
}

export function createBtnAcceptInTable() {
    let aBtnAccept = createABtnAccept();
    buildABtnAcceptInTable(aBtnAccept, true);
    return aBtnAccept;
}

export function createBtnDenyInTable() {
    let aBtnDeny = createABtnDeny();
    buildABtnDenyInTable(aBtnDeny, true);
    return aBtnDeny;
}

export function buildABtnStandard(aBtnElement, doRemoveChildren) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);

        if (doRemoveChildren) {
            aBtnElement.style.padding = "3px";
            aBtnElement.replaceChildren();
        }
    }
}

export function buildABtnAccept(aBtnElement, doRemoveChildren) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);

        if (doRemoveChildren) {
            aBtnElement.style.padding = "3px";

            aBtnElement.replaceChildren();
            let aAcceptButtonImg = document.createElement("img");
            aAcceptButtonImg.src = "/images/add.png";
            aAcceptButtonImg.width = 16;
            aAcceptButtonImg.height = 16;

            aBtnElement.appendChild(aAcceptButtonImg);
        }
    }
}

export function buildABtnDeny(aBtnElement, doRemoveChildren) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);

        if (doRemoveChildren) {
            aBtnElement.style.padding = "3px";

            aBtnElement.replaceChildren();
            let aDenyButtonImg = document.createElement("img");
            aDenyButtonImg.src = "/images/delete.png";
            aDenyButtonImg.width = 16;
            aDenyButtonImg.height = 16;

            aBtnElement.appendChild(aDenyButtonImg);
        }
    }
}

export function buildABtnDisabled(aBtnElement) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);

        aBtnElement.style.pointerEvents = "none";
        aBtnElement.style.cursor = "default";

        aBtnElement.style.opacity = "0.5";
        aBtnElement.style.padding = "3px";
    }
}

export function buildABtnArrowDown(aBtnElement) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);

        aBtnElement.style.padding = "3px";

        aBtnElement.replaceChildren();
        let aDenyButtonImg = document.createElement("img");
        aDenyButtonImg.src = "/images/arrow_down.png";
        aDenyButtonImg.width = 16;
        aDenyButtonImg.height = 16;

        aBtnElement.appendChild(aDenyButtonImg);
    }
}

export function buildABtnArrowUp(aBtnElement) {
    if (aBtnElement != null) {
        aBtnElement.className = "";
        aBtnElement.style.cssText = null;
        aBtnElement.classList.add(_CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);

        aBtnElement.style.padding = "3px";

        aBtnElement.replaceChildren();
        let aDenyButtonImg = document.createElement("img");
        aDenyButtonImg.src = "/images/arrow_up.png";
        aDenyButtonImg.width = 16;
        aDenyButtonImg.height = 16;

        aBtnElement.appendChild(aDenyButtonImg);
    }
}

export function buildABtnAcceptInTable(aBtnElement, doRemoveChildren) {
    buildABtnAccept(aBtnElement, doRemoveChildren);
    aBtnElement.style.borderRadius = "0px";
}

export function buildABtnDenyInTable(aBtnElement, doRemoveChildren) {
    buildABtnDeny(aBtnElement, doRemoveChildren);
    aBtnElement.style.borderRadius = "0px";
}

export function buildABtnDisabledInTable(aBtnElement) {
    buildABtnDisabled(aBtnElement);
    aBtnElement.style.borderRadius = "0px";
}

export function buildABtnArrowDownInTable(aBtnElement) {
    buildABtnArrowDown(aBtnElement);
    aBtnElement.style.borderRadius = "0px";
}

export function buildABtnArrowUpInTable(aBtnElement) {
    buildABtnArrowUp(aBtnElement);
    aBtnElement.style.borderRadius = "0px";
}


