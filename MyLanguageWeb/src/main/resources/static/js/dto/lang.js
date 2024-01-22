export class LangResponseDTO {
    id;
    title;
    code;

    constructor(langJson) {
        if (langJson) {
            this.id = langJson["id"];
            this.title = langJson["title"];
            this.code = langJson["code"];
        } else {
            this.id = 0n;
            this.title = "Без языка";
        }
    }
    #createElementLangWithFlag(differentElement) {
        let spanLangFlag = this.createSpanFlag();

        let spanLangTitle = document.createElement("span");
        spanLangTitle.textContent = " " + this.title;

        differentElement.appendChild(spanLangFlag);
        differentElement.appendChild(spanLangTitle);
    }

    setFlagStyle(differentElement) {
        differentElement.className = "";
        differentElement.style.cssText = null;

        differentElement.classList.add("fi");
        if (this.code) {
            differentElement.classList.add(`fi-${this.code}`);
        } else {
            differentElement.style.backgroundImage = "url(/images/other/empty_flag.png)";
        }
    }

    createSpanFlag() {
        let spanFlag = document.createElement("span");
        this.setFlagStyle(spanFlag);

        return spanFlag;
    }

    createDivLangWithFlag() {
        let div = document.createElement("div");
        this.#createElementLangWithFlag(div);

        return div;
    }

    createSpanLangWithFlag() {
        let span = document.createElement("span");
        this.#createElementLangWithFlag(span);

        return span;
    }
}