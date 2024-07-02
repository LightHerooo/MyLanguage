import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    BigIntUtils
} from "../../../../utils/bigint_utils.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _HTTP_STATUSES = new HttpStatuses();

const _PROJECT_COOKIES = new ProjectCookies();
const _BIGINT_UTILS = new BigIntUtils();

export class SelectElementCustomerCollectionsUtils {
    async #createOptionsArr(jsonResponse){
        let optionsArr = [];

        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let collection = new CustomerCollectionResponseDTO(json[i]);

                let option = document.createElement("option");
                option.value = collection.getId();
                option.textContent = collection.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async createOptionsArr() {
        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAll(
            null, null, true, customerId);

        return this.#createOptionsArr(jsonResponse);
    }

    async createOptionArrByLangOutCode(langOutCode) {
        let optionsArr;

        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllForAuthorByLangOutCode(langOutCode, customerId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            optionsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let collection = new CustomerCollectionResponseDTO(json[i]);

                let option = document.createElement("option");
                option.value = collection.getId();
                option.textContent = collection.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async changeFlag(selectElementCustomerCollectionsObj) {
        if (selectElementCustomerCollectionsObj) {
            let spanFlagElement = selectElementCustomerCollectionsObj.getSpanFlagElement();
            if (spanFlagElement) {
                let countryName;
                let countryCode;

                let customerCollectionId = selectElementCustomerCollectionsObj.getSelectedValue();
                if (customerCollectionId) {
                    let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        let collection = new CustomerCollectionResponseDTO(jsonResponse.getJson());
                        let lang = collection.getLang();
                        if (lang) {
                            let country = lang.getCountry();
                            if (country) {
                                countryName = country.getTitle();
                                countryCode = country.getCode();
                            }
                        }
                    }
                }

                spanFlagElement.changeFlag(countryName, countryCode, true);
            }
        }
    }

    getSelectedValue(selectElementCustomerCollectionsObj) {
        let value;

        if (selectElementCustomerCollectionsObj) {
            let selectedOption = selectElementCustomerCollectionsObj.getSelectedOption();
            if (selectedOption) {
                let valueStr = selectedOption.value;
                value = _BIGINT_UTILS.parse(valueStr);
            }
        }

        return value;
    }
}