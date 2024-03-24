import {
    LangResponseDTO
} from "../entity/lang.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

const _FLAG_ELEMENTS = new FlagElements();

export class CustomerCollectionsStatisticResponseDTO {
    numberOfCollections;
    lang;

    constructor(customerCollectionsWithLangStatisticJson) {
        this.numberOfCollections = customerCollectionsWithLangStatisticJson["number_of_collections"];

        let lang = customerCollectionsWithLangStatisticJson["lang"];
        if (lang) {
            this.lang = new LangResponseDTO(lang);
        }
    }

    async createDiv() {
        let div;

        if (this.lang) {
            div = document.createElement("div");
            div.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

            // Создаём span языка (с флагом) ---
            let spanLang = document.createElement("div");
            spanLang.style.display = "flex";
            spanLang.style.flexDirection = "row";
            spanLang.style.gap = "5px";

            let spanFlag = _FLAG_ELEMENTS.SPAN.create(this.lang.country, false);
            spanLang.appendChild(spanFlag);

            let spanLangTitle = document.createElement("span");
            spanLangTitle.style.fontWeight = "bold";
            spanLangTitle.textContent = `${this.lang.title}:`;
            spanLang.appendChild(spanLangTitle);
            //---

            // Добавляем название языка с флагом в контейнер ---
            let spanInfoAboutData = document.createElement("span");
            spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
            spanInfoAboutData.appendChild(spanLang);

            div.appendChild(spanInfoAboutData);
            //---

            // Создаём span количества коллекций ---
            let spanData = document.createElement("span")
            spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID)
            spanData.textContent = `${this.numberOfCollections}`;

            div.appendChild(spanData);
            //---
        }

        return div;
    }
}