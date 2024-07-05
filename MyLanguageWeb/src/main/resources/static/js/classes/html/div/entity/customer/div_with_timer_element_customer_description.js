import {
    DivWithTimerAbstractElement
} from "../../abstracts/div_with_timer_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    DivWithDataBuilderElement
} from "../../data_builder/div_with_data_builder_element.js";

import {
    CustomersAPI
} from "../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CustomerResponseDTO
} from "../../../../dto/entity/customer/response/customer_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

const _CUSTOMERS_API = new CustomersAPI();

const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class DivWithTimerElementCustomerDescription extends DivWithTimerAbstractElement {
    #customerId;

    constructor(div) {
        super(div);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    async tryToCreateContent() {
        let div;

        let customerId = this.#customerId;
        if (customerId) {
            let jsonResponse = await _CUSTOMERS_API.GET.findById(customerId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let customerResponseDTO = new CustomerResponseDTO(jsonResponse.getJson());
                let description = customerResponseDTO.getDescription();
                if (description) {
                    let divWithTimerElementCustomerDescriptionShowMore =
                        new DivWithTimerElementCustomerDescriptionShowMore(null);
                    divWithTimerElementCustomerDescriptionShowMore.setDescription(description);
                    await divWithTimerElementCustomerDescriptionShowMore.prepare();

                    let divWithDataBuilderElement = new DivWithDataBuilderElement();
                    divWithDataBuilderElement.addSpanShowMore(divWithTimerElementCustomerDescriptionShowMore,
                        "Показать описание...",
                        "Скрыть описание...");

                    div = divWithDataBuilderElement.getDivContainer();
                } else {
                    this.showMessage("Описание отсутствует", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
                }
            } else {
                this.showRule(_RULE_TYPES.ERROR, new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Пользователь не установлен");
        }

        return div;
    }
}

class DivWithTimerElementCustomerDescriptionShowMore extends DivWithTimerAbstractElement {
    #description;

    constructor(div) {
        super(div);
    }

    setDescription(description) {
        this.#description = description;
    }

    async tryToCreateContent() {
        let div;

        let description = this.#description;
        if (description) {
            div = document.createElement("div");
            div.style.fontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
            div.style.whiteSpace = "pre-wrap";
            div.textContent = description;
        } else {
            this.showMessage("Описание отсутствует", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}