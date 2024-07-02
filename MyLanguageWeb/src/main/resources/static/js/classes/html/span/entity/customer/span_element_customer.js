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
    CustomersAPI
} from "../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../elements/rule/rule_types.js";

import {
    CustomerResponseDTO
} from "../../../../dto/entity/customer/response/customer_response_dto.js";

const _CUSTOMERS_API = new CustomersAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class SpanElementCustomer extends SpanAbstractElement {
    #customerId;
    #customerResponseDTO;

    #spanNickname;

    constructor(span) {
        super(span);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    setCustomerResponseDTO(customerResponseDTOObj) {
        this.#customerResponseDTO = customerResponseDTOObj;
    }

    getSpanNickname() {
        return this.#spanNickname;
    }


    #createSpan(customerResponseDTOObj) {
        let spanContainer;
        if (customerResponseDTOObj) {
            spanContainer = document.createElement("span");

            // Флаг ---
            let spanFlagElement = new SpanFlagElement(null);

            let countryName;
            let countryCode;
            let country = customerResponseDTOObj.getCountry();
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

            // Никнейм ---
            let spanNickname = document.createElement("span");
            spanNickname.textContent = customerResponseDTOObj.getNickname();

            let role = customerResponseDTOObj.getRole();
            if (role) {
                let color = role.getColor();
                if (color) {
                    spanNickname.style.fontWeight = "bold";
                    spanNickname.style.color = `#${color.getHexCode()}`;
                }
            }

            spanContainer.appendChild(spanNickname);
            //---

            this.#spanNickname = spanNickname;
        }

        return spanContainer;
    }


    async tryToCreateContent() {
        let span;

        let customResponseMessage;
        let customerResponseDTO = this.#customerResponseDTO;
        if (!customerResponseDTO || !customerResponseDTO.getId()) {
            let customerId = this.#customerId;
            if (customerId) {
                let jsonResponse = await _CUSTOMERS_API.GET.findById(customerId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    customerResponseDTO = new CustomerResponseDTO(jsonResponse.getJson());
                } else {
                    customResponseMessage = new ResponseMessageResponseDTO(jsonResponse.getJson());
                }
            }
        }

        if (customerResponseDTO) {
            span = this.#createSpan(customerResponseDTO);
        } else if (customResponseMessage) {
            this.showRule(_RULE_TYPES.ERROR, customResponseMessage.text);
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Пользователь не указан");
        }

        return span;
    }
}