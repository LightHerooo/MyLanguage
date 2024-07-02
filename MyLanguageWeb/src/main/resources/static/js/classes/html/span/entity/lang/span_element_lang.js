import {
    SpanAbstractElement
} from "../../abstracts/span_abstract_element.js";

import {
    SpanFlagElement
} from "../../elements/span_flag_element.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    LangsAPI
} from "../../../../api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../elements/rule/rule_types.js";

import {
    LangResponseDTO
} from "../../../../dto/entity/lang/response/lang_response_dto.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class SpanElementLang extends SpanAbstractElement {
    #langCode;
    #langResponseDTO;

    constructor(span) {
        super(span);
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }

    setLangResponseDTO(langResponseDTOObj) {
        this.#langResponseDTO = langResponseDTOObj;
    }


    #createSpan(langResponseDTOObj) {
        let spanContainer;
        if (langResponseDTOObj) {
            spanContainer = document.createElement("span");

            // Флаг языка ---
            let spanFlagElement = new SpanFlagElement(null);

            let countryName;
            let countryCode;
            let country = langResponseDTOObj.getCountry();
            if (country) {
                countryName = country.getTitle();
                countryCode = country.getCode();
            }

            spanFlagElement.changeFlag(countryName, countryCode, false);
            spanContainer.appendChild(spanFlagElement.getSpan());
            //---

            // Пробел ---
            let span = document.createElement("span");
            span.textContent = " ";

            spanContainer.appendChild(span);
            //---

            // Название ---
            span = document.createElement("span");
            span.textContent = langResponseDTOObj.getTitle();

            spanContainer.appendChild(span);
            //---
        }

        return spanContainer;
    }


    async tryToCreateContent() {
        let span;

        let customResponseMessage;
        let langResponseDTO = this.#langResponseDTO;
        if (!langResponseDTO || !langResponseDTO.getId()) {
            let langCode = this.#langCode;
            if (langCode) {
                let jsonResponse = await _LANGS_API.GET.findByCode(langCode);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    langResponseDTO = new LangResponseDTO(jsonResponse.getJson());
                } else {
                    customResponseMessage = new ResponseMessageResponseDTO(jsonResponse.getJson());
                }
            }
        }

        if (langResponseDTO) {
            span = this.#createSpan(langResponseDTO);
        } else if (customResponseMessage) {
            this.showRule(_RULE_TYPES.ERROR, customResponseMessage.getMessage());
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Язык не указан");
        }

        return span;
    }
}