import {
    DivWithTimerAbstractElement
} from "../../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    CustomerCollectionsStatisticResponseDTO
} from "../../../../../dto/entity/customer_collection/types/customer_collections_statistic_response_dto.js";

import {
    CustomerCollectionsAPI
} from "../../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    ElementsForDivWithDataBuilder
} from "../../../data_builder/elements_for_div_with_data_builder.js";

import {
    DivWithHeaderAndDataBuilderElement
} from "../../../data_builder/with_header/div_with_header_and_data_builder_element.js";

import {
    DivWithDataBuilderElement
} from "../../../data_builder/div_with_data_builder_element.js";

import {
    SpanElementLang
} from "../../../../span/entity/lang/span_element_lang.js";

import {
    ValueResponseDTO
} from "../../../../../dto/other/response/value/value_response_dto.js";

import {
    ProjectCookies
} from "../../../../project_cookies.js";

const _CSS_ROOT = new CssRoot();

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _PROJECT_COOKIES = new ProjectCookies();
const _HTTP_STATUSES = new HttpStatuses();

export class DivWithTimerElementCustomerCollectionsStatistic extends DivWithTimerAbstractElement {
    #maxRowsInStatistic = 3;

    constructor(div) {
        super(div);
    }

    async #createImportantElementsForDivWithDataBuilderArr(customerCollectionsStatisticJson) {
        let elementsForDivWithDataBuilderArr;
        if (customerCollectionsStatisticJson) {
            elementsForDivWithDataBuilderArr = [];

            let sumOfCollections = 0n;
            for (let i = 0; i < customerCollectionsStatisticJson.length; i++) {
                let customerCollectionsStatisticResponseDTO =
                    new CustomerCollectionsStatisticResponseDTO(customerCollectionsStatisticJson[i]);

                if (i < this.#maxRowsInStatistic) {
                    let elementsForDivWithDataBuilderByCustomerCollectionStatistic =
                        new ElementsForDivWithDataBuilderByCustomerCollectionStatistic(customerCollectionsStatisticResponseDTO);
                    await elementsForDivWithDataBuilderByCustomerCollectionStatistic.prepare();

                    elementsForDivWithDataBuilderArr.push(elementsForDivWithDataBuilderByCustomerCollectionStatistic);
                }

                sumOfCollections += customerCollectionsStatisticResponseDTO.getNumberOfCollections();
            }

            // Общее количество коллекций ---
            let leftSpan = document.createElement("span");
            leftSpan.textContent = "Общее количество:";

            let rightSpan = document.createElement("span");
            rightSpan.textContent = `${sumOfCollections}`;

            let elementsForDivWithDataBuilder = new ElementsForDivWithDataBuilder();
            elementsForDivWithDataBuilder.setLeftSpan(leftSpan);
            elementsForDivWithDataBuilder.setRightSpan(rightSpan);

            elementsForDivWithDataBuilderArr.unshift(elementsForDivWithDataBuilder);
            //---
        }

        return elementsForDivWithDataBuilderArr;
    }

    async #tryToCreatePersonalityStatistic() {
        let div;

        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getCustomerStatistic(customerId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();

            let elementsForDivWithDataBuilderArr = await this.#createImportantElementsForDivWithDataBuilderArr(json);
            if (elementsForDivWithDataBuilderArr) {
                let divWithHeaderAndDataBuilderElement = new DivWithHeaderAndDataBuilderElement();
                divWithHeaderAndDataBuilderElement.setHeaderByStr("Статистика по количеству ваших коллекций:");

                for (let elementForDataBuilder of elementsForDivWithDataBuilderArr) {
                    divWithHeaderAndDataBuilderElement.addDataRowBySpan(elementForDataBuilder.getLeftSpan(),
                        elementForDataBuilder.getRightSpan());
                }

                let maxRowsInStatistic = this.#maxRowsInStatistic;
                if (json && json.length > maxRowsInStatistic) {
                    let divWithTimerElementShowMoreCustomerCollectionsStatistic =
                        new DivWithTimerElementShowMoreCustomerCollections(null);
                    divWithTimerElementShowMoreCustomerCollectionsStatistic.setTimeout(250);
                    divWithTimerElementShowMoreCustomerCollectionsStatistic.setCustomerCollectionsStatisticJson(json);
                    divWithTimerElementShowMoreCustomerCollectionsStatistic.setStartIndex(maxRowsInStatistic);
                    await divWithTimerElementShowMoreCustomerCollectionsStatistic.prepare();

                    divWithHeaderAndDataBuilderElement.addSpanShowMore(divWithTimerElementShowMoreCustomerCollectionsStatistic);
                }

                divWithHeaderAndDataBuilderElement.addBr();

                // Считаем количество активных/неактивных коллекций ---
                let sumOfActiveCollections = 0n;
                jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getCountForAuthor(true, customerId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    sumOfActiveCollections = new ValueResponseDTO(jsonResponse.getJson()).getValue();
                }

                let sumOfInactiveCollections = 0n;
                jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getCountForAuthor(false, customerId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    sumOfInactiveCollections = new ValueResponseDTO(jsonResponse.getJson()).getValue();
                }

                if (sumOfActiveCollections > 0n && sumOfInactiveCollections === 0n) {
                    divWithHeaderAndDataBuilderElement.addExtraContentByStr("Все коллекции активны!");
                } else if (sumOfInactiveCollections > 0n && sumOfActiveCollections === 0n) {
                    divWithHeaderAndDataBuilderElement.addExtraContentByStr("Все коллекции неактивны!");
                } else if (sumOfActiveCollections > 0n && sumOfInactiveCollections > 0n) {
                    divWithHeaderAndDataBuilderElement.addDataRowByStr("Активных коллекций:", sumOfActiveCollections);
                    divWithHeaderAndDataBuilderElement.addDataRowByStr("Неактивных коллекций:", sumOfInactiveCollections);
                }
                //---

                div = divWithHeaderAndDataBuilderElement.getDivWithHeaderAndDataContainer();
            }
        }

        return div;
    }

    async tryToCreateContent() {
        let div = await this.#tryToCreatePersonalityStatistic();

        if (!div) {
            this.showMessage("Не удалось отобразить статистику", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}

class ElementsForDivWithDataBuilderByCustomerCollectionStatistic extends ElementsForDivWithDataBuilder {
    #customerCollectionStatisticResponseDTO;

    #isPrepared = false;

    constructor(customerCollectionStatisticResponseDTO) {
        super();
        this.#customerCollectionStatisticResponseDTO = customerCollectionStatisticResponseDTO;
    }

    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let customerCollectionStatisticResponseDTO = this.#customerCollectionStatisticResponseDTO;
            if (customerCollectionStatisticResponseDTO) {
                let lang = customerCollectionStatisticResponseDTO.getLang();
                if (lang) {
                    // Название языка с флагом и двоеточием ---
                    let leftSpan = document.createElement("span");
                    leftSpan.style.gap = "0px";

                    let spanElementLang = new SpanElementLang(null);
                    spanElementLang.setLangResponseDTO(lang);
                    await spanElementLang.prepare();
                    await spanElementLang.fill();
                    leftSpan.appendChild(spanElementLang.getSpan());

                    let spanColon = document.createElement("span");
                    spanColon.textContent = ":";
                    leftSpan.appendChild(spanColon);

                    this.setLeftSpan(leftSpan);
                    //---

                    // Количество коллекций ---
                    let rightSpan = document.createElement("span");
                    rightSpan.textContent = `${customerCollectionStatisticResponseDTO.getNumberOfCollections()}`;

                    this.setRightSpan(rightSpan);
                    //---
                }
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'ElementsForDivWithDataBuilderByCustomerCollectionStatistic\' has already been prepared.");
        }
    }
}

class DivWithTimerElementShowMoreCustomerCollections extends DivWithTimerAbstractElement {
    #customerCollectionsStatisticJson;
    #startIndex = 0;

    constructor(div) {
        super(div);
    }

    setCustomerCollectionsStatisticJson(customerCollectionsStatisticJson) {
        this.#customerCollectionsStatisticJson = customerCollectionsStatisticJson;
    }

    setStartIndex(startIndex) {
        this.#startIndex = startIndex;
    }

    async tryToCreateContent() {
        let div;
        let customerCollectionsStatisticJson = this.#customerCollectionsStatisticJson;
        let startIndex = this.#startIndex;
        if (customerCollectionsStatisticJson && customerCollectionsStatisticJson.length >= startIndex) {
            let divWithDataBuilderElement = new DivWithDataBuilderElement();

            for (let i = startIndex; i < customerCollectionsStatisticJson.length; i++) {
                let customerCollectionsStatistic =
                    new CustomerCollectionsStatisticResponseDTO(customerCollectionsStatisticJson[i]);

                let elementsForDivWithDataBuilderByCustomerCollectionStatistic =
                    new ElementsForDivWithDataBuilderByCustomerCollectionStatistic(customerCollectionsStatistic);
                await elementsForDivWithDataBuilderByCustomerCollectionStatistic.prepare();

                divWithDataBuilderElement.addDataRowBySpan(elementsForDivWithDataBuilderByCustomerCollectionStatistic.getLeftSpan(),
                    elementsForDivWithDataBuilderByCustomerCollectionStatistic.getRightSpan());
            }

            div = divWithDataBuilderElement.getDivContainer();
        }

        return div;
    }
}