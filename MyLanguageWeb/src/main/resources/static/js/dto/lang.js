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

    createSpanFlag() {

        let spanFlag = document.createElement("span");
        spanFlag.classList.add("fi");
        if (this.code) {
            spanFlag.classList.add(`fi-${this.code}`);
        } else {
            spanFlag.style.backgroundImage = "url(/images/empty_flag.png)";
        }

        return spanFlag;
    }

    #createElementLangWithFlag(differentElement) {
        let spanLangFlag = this.createSpanFlag();

        let spanLangTitle = document.createElement("span");
        spanLangTitle.textContent = " " + this.title;

        differentElement.appendChild(spanLangFlag);
        differentElement.appendChild(spanLangTitle);
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