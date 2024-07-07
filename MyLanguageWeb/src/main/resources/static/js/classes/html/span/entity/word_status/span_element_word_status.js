import {
    SpanAbstractElement
} from "../../abstracts/span_abstract_element.js";

import {
    WordStatusesAPI
} from "../../../../api/entity/word_statuses_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CssSpanElement
} from "../../../../css/elements/span/css_span_element.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    RuleTypes
} from "../../elements/rule/rule_types.js";

import {
    WordStatusResponseDTO
} from "../../../../dto/entity/word_status/response/word_status_response_dto.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

const _CSS_SPAN_ELEMENT = new CssSpanElement();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class SpanElementWordStatus extends SpanAbstractElement {
    #wordStatusCode;
    #wordStatusResponseDTO;

    constructor(span) {
        super(span);
    }

    setWordStatusCode(wordStatusCode) {
        this.#wordStatusCode = wordStatusCode;
    }

    setWordStatusResponseDTO(wordStatusResponseDTOObj) {
        this.#wordStatusResponseDTO = wordStatusResponseDTOObj;
    }


    #createSpan(wordStatusResponseDTOObj) {
        let span;
        if (wordStatusResponseDTOObj) {
            span = document.createElement("span");
            span.classList.add(_CSS_SPAN_ELEMENT.SPAN_ELEMENT_FOR_HINT_CLASS_ID);

            let color = wordStatusResponseDTOObj.getColor();
            if (color) {
                span.style.color = "#" + color.getHexCode();
            }

            span.title = wordStatusResponseDTOObj.getDescription();
            span.textContent = wordStatusResponseDTOObj.getTitle();
        }

        return span;
    }


    async tryToCreateContent() {
        let span;

        let customResponseMessage;
        let wordStatusResponseDTO = this.#wordStatusResponseDTO;
        if (!wordStatusResponseDTO || !wordStatusResponseDTO.getId()) {
            let wordStatusCode = this.#wordStatusCode;
            if (wordStatusCode) {
                let jsonResponse = await _WORD_STATUSES_API.GET.findByCode(wordStatusCode);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    wordStatusResponseDTO = new WordStatusResponseDTO(jsonResponse.getJson());
                } else {
                    customResponseMessage = new ResponseMessageResponseDTO(jsonResponse.getJson());
                }
            }
        }

        if (wordStatusResponseDTO) {
            span = this.#createSpan(wordStatusResponseDTO);
        } else if (customResponseMessage) {
            this.showRule(_RULE_TYPES.ERROR, customResponseMessage.getMessage());
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Статус слова не указан");
        }

        return span;
    }
}