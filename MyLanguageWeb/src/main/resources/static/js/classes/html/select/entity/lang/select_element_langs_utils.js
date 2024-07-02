import {
    LangsAPI
} from "../../../../api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    LangResponseDTO
} from "../../../../dto/entity/lang/response/lang_response_dto.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

const _LANGS_API = new LangsAPI();
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _HTTP_STATUSES = new HttpStatuses();

export class SelectElementLangsUtils {
    async #createOptionsArr(jsonResponse) {
        let optionsArr = [];

        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let lang = new LangResponseDTO(json[i]);

                let option = document.createElement("option");
                option.value = lang.getCode();
                option.textContent = lang.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async createOptionsArrForIn() {
        let jsonResponse = await _LANGS_API.GET.getAllForIn();
        return await this.#createOptionsArr(jsonResponse);
    }

    async createOptionsArrForInByLangOutCode(langOutCode) {
        let jsonResponse = await _LANGS_API.GET.getAllForInByLangOutCode(langOutCode);
        return await this.#createOptionsArr(jsonResponse);
    }

    async createOptionsArrForOut() {
        let jsonResponse = await _LANGS_API.GET.getAllForOut();
        return await this.#createOptionsArr(jsonResponse);
    }

    async createOptionsArrForOutByLangInCode(langInCode) {
        let jsonResponse = await _LANGS_API.GET.getAllForOutByLangInCode(langInCode);
        return await this.#createOptionsArr(jsonResponse);
    }

    async createOptionsArrForOutByCustomerCollectionId(customerCollectionId) {
        let optionsArr = [];

        let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let customerCollectionResponseDTO =
                new CustomerCollectionResponseDTO(jsonResponse.getJson());

            let lang = customerCollectionResponseDTO.getLang();
            if (lang) {
                optionsArr = await this.createOptionsArrForOutByLangInCode(lang.getCode());
            }
        }

        return optionsArr;
    }

    async changeFlag(selectElementLangsObj) {
        if (selectElementLangsObj) {
            let spanFlagElement = selectElementLangsObj.getSpanFlagElement();
            if (spanFlagElement) {
                let countryName;
                let countryCode;

                let langCode = selectElementLangsObj.getSelectedValue();
                if (langCode) {
                    let jsonResponse = await _LANGS_API.GET.findByCode(langCode);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        let lang = new LangResponseDTO(jsonResponse.getJson());
                        let country = lang.getCountry();
                        if (country) {
                            countryName = country.getTitle();
                            countryCode = country.getCode();
                        }
                    }
                }

                spanFlagElement.changeFlag(countryName, countryCode, true);
            }
        }
    }
}