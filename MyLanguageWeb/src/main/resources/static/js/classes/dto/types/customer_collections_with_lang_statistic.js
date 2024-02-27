import {
    LangsAPI
} from "../../api/langs_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    LangResponseDTO
} from "../entity/lang.js";

import {
    FlagElements
} from "../../flag_elements.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _FLAG_ELEMENTS = new FlagElements();

export class CustomerCollectionsWithLangStatisticResponseDTO {
    langCode;
    numberOfCollections;

    constructor(customerCollectionsWithLangStatisticJson) {
        this.langCode = customerCollectionsWithLangStatisticJson["lang_code"];
        this.numberOfCollections = customerCollectionsWithLangStatisticJson["number_of_collections"];
    }

    async createDiv() {
        let div;

        let JSONResponse = await _LANGS_API.GET.findByCode(this.langCode);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let lang = new LangResponseDTO(JSONResponse.json);

            div = document.createElement("div");
            div.style.display = "flex";

            // Создаём span языка (с флагом) ---
            let spanFlag = _FLAG_ELEMENTS.SPAN.create(lang.code, false);
            div.appendChild(spanFlag);

            let spanSpace = document.createElement("span");
            spanSpace.style.width = "5px";
            div.appendChild(spanSpace);

            let spanLangText = document.createElement("span");
            spanLangText.style.fontWeight = "bold";
            spanLangText.style.textDecoration = "underline";
            spanLangText.textContent = lang.title;
            div.appendChild(spanLangText);
            //---

            // Создаём span количества коллекций ---
            let spanNumberOfCollections = document.createElement("span")
            spanNumberOfCollections.textContent = `: ${this.numberOfCollections}`;
            div.appendChild(spanNumberOfCollections);
            //---
        }

        return div;
    }
}