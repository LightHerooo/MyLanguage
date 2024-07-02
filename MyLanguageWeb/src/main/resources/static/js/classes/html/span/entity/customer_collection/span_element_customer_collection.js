import {
    SpanAbstractElement
} from "../../abstracts/span_abstract_element.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    SpanFlagElement
} from "../../elements/span_flag_element.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    RuleTypes
} from "../../elements/rule/rule_types.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class SpanElementCustomerCollection extends SpanAbstractElement {
    #customerCollectionId;
    #customerCollectionResponseDTO;

    constructor(span) {
        super(span);
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }

    setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj) {
        this.#customerCollectionResponseDTO = customerCollectionResponseDTOObj;
    }


    #createSpan(customerCollectionResponseDTOObj) {
        let spanContainer;
        if (customerCollectionResponseDTOObj) {
            spanContainer = document.createElement("span");

            // Флаг коллекции ---
            let spanFlagElement = new SpanFlagElement(null);

            let countryName;
            let countryCode;
            let lang = customerCollectionResponseDTOObj.getLang();
            if (lang) {
                let country = lang.getCountry();
                if (country) {
                    countryName = country.getTitle();
                    countryCode = country.getCode();
                }
            }

            spanFlagElement.changeFlag(countryName, countryCode, false);
            spanContainer.appendChild(spanFlagElement.getSpan());
            //---

            // Пробел ---
            let span = document.createElement("span");
            span.textContent = " ";

            spanContainer.appendChild(span);
            //---

            // Название коллекции ---
            span = document.createElement("span");
            span.textContent = customerCollectionResponseDTOObj.getTitle();

            spanContainer.appendChild(span);
            //---
        }

        return spanContainer;
    }


    async tryToCreateContent() {
        let span;

        let customResponseMessage;
        let customerCollectionResponseDTO = this.#customerCollectionResponseDTO;
        if (!customerCollectionResponseDTO || !customerCollectionResponseDTO.getId()) {
            let customerCollectionId = this.#customerCollectionId;
            if (customerCollectionId) {
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    customerCollectionResponseDTO = new CustomerCollectionResponseDTO(jsonResponse.getJson());
                } else {
                    customResponseMessage = new ResponseMessageResponseDTO(jsonResponse.getJson());
                }
            }
        }

        if (customerCollectionResponseDTO) {
            span = this.#createSpan(customerCollectionResponseDTO);
        } else if (customResponseMessage) {
            this.showRule(_RULE_TYPES.ERROR, customResponseMessage.getMessage())
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Коллекция не указана");
        }

        return span;
    }
}