import {
    FlagElements
} from "../../flag_elements.js";

const _FLAG_ELEMENTS = new FlagElements();

export class LangWithCount {
    lang;
    count;

    constructor(langObj, count) {
        this.lang = langObj;
        this.count = count;
    }

    createDiv() {
        // Название языка ---
        let spanSpace = document.createElement("span");
        spanSpace.textContent = " ";

        let aLangTitle = document.createElement("a");
        aLangTitle.textContent = this.lang.title;
        aLangTitle.style.textDecoration = "underline";
        aLangTitle.style.fontWeight = "bold";
        //---

        // Количество коллекций ---
        let spanNumberOfCollections = document.createElement("span");
        spanNumberOfCollections.textContent = `: ${this.count}`;
        //---

        // Создаём основной контейнер ---
        let div = document.createElement("div");
        div.appendChild(_FLAG_ELEMENTS.SPAN.create(this.lang.code));
        div.appendChild(spanSpace);
        div.appendChild(aLangTitle);
        div.appendChild(spanNumberOfCollections);
        //---

        return div;
    }
}

export function compareLangWithCount(firstObj, secondObj) {
    if (firstObj.count < secondObj.count) {
        return 1;
    } else if (firstObj.count > secondObj.count) {
        return -1;
    } else {
        return 0;
    }
}