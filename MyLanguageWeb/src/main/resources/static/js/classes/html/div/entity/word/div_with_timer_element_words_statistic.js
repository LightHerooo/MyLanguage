import {
    DivWithTimerAbstractElement
} from "../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    WordsStatisticResponseDTO
} from "../../../../dto/entity/word/types/words_statistic_response_dto.js";

import {
    WordsAPI
} from "../../../../api/entity/words_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    SpanElementWordStatus
} from "../../../span/entity/word_status/span_element_word_status.js";

import {
    DivWithHeaderAndDataBuilderElement
} from "../../data_builder/with_header/div_with_header_and_data_builder_element.js";

import {
    ElementsForDivWithDataBuilder
} from "../../data_builder/elements_for_div_with_data_builder.js";

import {
    ValueResponseDTO
} from "../../../../dto/other/response/value/value_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    DateParts
} from "../../../date_parts.js";

const _CSS_ROOT = new CssRoot();

const _WORDS_API = new WordsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();

export class DivWithTimerElementWordsStatistic extends DivWithTimerAbstractElement {
    #isPersonalityStatistic = false;

    constructor(div, isPersonalityStatistic) {
        super(div);
        this.#isPersonalityStatistic = isPersonalityStatistic;
    }

    async #createImportantElementsForDivWithDataBuilderArr(jsonResponseObj) {
        let elementsForDataBuilderArr;
        if (jsonResponseObj.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponseObj.getJson();
            if (json) {
                elementsForDataBuilderArr = [];

                let sumOfWords = 0n;
                for (let i = 0; i < json.length; i++) {
                    let wordStatisticResponseDTO =
                        new WordsStatisticResponseDTO(json[i]);

                    let elementsForDivWithDataBuilderByWordStatistic =
                        new ElementsForDivWithDataBuilderByWordStatistic(wordStatisticResponseDTO);
                    await elementsForDivWithDataBuilderByWordStatistic.prepare();

                    elementsForDataBuilderArr.push(elementsForDivWithDataBuilderByWordStatistic);
                    sumOfWords += wordStatisticResponseDTO.getNumberOfWords();
                }

                // Общее количество слов ---
                let leftSpan = document.createElement("span");
                leftSpan.textContent = "Общее количество:";

                let rightSpan = document.createElement("span");
                rightSpan.textContent = `${sumOfWords}`;

                let elementsForDivWithDataBuilder = new ElementsForDivWithDataBuilder();
                elementsForDivWithDataBuilder.setLeftSpan(leftSpan);
                elementsForDivWithDataBuilder.setRightSpan(rightSpan);

                elementsForDataBuilderArr.unshift(elementsForDivWithDataBuilder);
                //---
            }
        }

        return elementsForDataBuilderArr;
    }

    async #tryToCreateDivStatistic() {
        let div;

        let jsonResponse = await _WORDS_API.GET.getStatistic();

        let elementsForDataBuilderArr = await this.#createImportantElementsForDivWithDataBuilderArr(jsonResponse);
        if (elementsForDataBuilderArr) {
            let divWithHeaderAndDataBuilderElement = new DivWithHeaderAndDataBuilderElement();
            divWithHeaderAndDataBuilderElement.setHeaderByStr("Статистика по количеству слов:");

            for (let elementForDataBuilder of elementsForDataBuilderArr) {
                divWithHeaderAndDataBuilderElement.addDataRowBySpan(elementForDataBuilder.getLeftSpan(),
                    elementForDataBuilder.getRightSpan());
            }

            divWithHeaderAndDataBuilderElement.addBr();

            // Слова за сегодняшний день ---
            let dateNow = new Date();
            jsonResponse = await _WORDS_API.GET.getCountByDateOfCreate(dateNow);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let leftStr = `За сегодня (${new DateParts(dateNow).getDateStr()}) предложено слов:`;
                let rightStr = `${new ValueResponseDTO(jsonResponse.getJson()).getValue()}`;

                divWithHeaderAndDataBuilderElement.addDataRowByStr(leftStr, rightStr);
            }
            //---

            div = divWithHeaderAndDataBuilderElement.getDivWithHeaderAndDataContainer();
        }

        return div;
    }

    async #tryToCreateDivPersonalityStatistic() {
        let div;

        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
        let jsonResponse = await _WORDS_API.GET.getCustomerStatistic(customerId);

        let elementsForDataBuilderArr = await this.#createImportantElementsForDivWithDataBuilderArr(
            jsonResponse);
        if (elementsForDataBuilderArr) {
            let divWithHeaderAndDataBuilderElement = new DivWithHeaderAndDataBuilderElement();
            divWithHeaderAndDataBuilderElement.setHeaderByStr("Статистика по количеству предложенных вами слов:");

            for (let elementForDataBuilder of elementsForDataBuilderArr) {
                divWithHeaderAndDataBuilderElement.addDataRowBySpan(elementForDataBuilder.getLeftSpan(),
                    elementForDataBuilder.getRightSpan());
            }

            div = divWithHeaderAndDataBuilderElement.getDivWithHeaderAndDataContainer();
        }

        return div;
    }


    async tryToCreateContent() {
        let div;
        let isPersonalityStatistic = this.#isPersonalityStatistic;
        if (isPersonalityStatistic) {
            div = await this.#tryToCreateDivPersonalityStatistic();
        } else {
            div = await this.#tryToCreateDivStatistic();
        }

        if (!div) {
            this.showMessage("Не удалось отобразить статистику", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}

class ElementsForDivWithDataBuilderByWordStatistic extends ElementsForDivWithDataBuilder {
    #wordStatisticResponseDTO = new WordsStatisticResponseDTO();

    constructor(wordStatisticResponseDTO) {
        super();
        this.#wordStatisticResponseDTO = wordStatisticResponseDTO;
    }

    async prepare() {
        let wordStatisticResponseDTO = this.#wordStatisticResponseDTO;
        if (wordStatisticResponseDTO) {
            // Статус слова ---
            let leftSpan = document.createElement("span");

            let spanElementWordStatus = new SpanElementWordStatus(null);
            spanElementWordStatus.setWordStatusResponseDTO(wordStatisticResponseDTO.getWordStatus());
            await spanElementWordStatus.prepare();
            await spanElementWordStatus.fill();
            leftSpan.appendChild(spanElementWordStatus.getSpan());

            let spanColon = document.createElement("span");
            spanColon.textContent = ":";
            leftSpan.appendChild(spanColon);

            this.setLeftSpan(leftSpan);
            //---

            // Количество слов с выделенным статусом ---
            let rightSpan = document.createElement("span");
            rightSpan.textContent = wordStatisticResponseDTO.getNumberOfWords();

            this.setRightSpan(rightSpan);
            //---
        }
    }
}

