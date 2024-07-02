import {
    CountriesAPI
} from "../../../../api/entity/countries_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CountryResponseDTO
} from "../../../../dto/entity/country/response/country_response_dto.js";

const _COUNTRIES_API = new CountriesAPI();

const _HTTP_STATUSES = new HttpStatuses();

export class SelectElementCountriesUtils {
    async createOptionsArr() {
        let optionsArr = [];

        let jsonResponse = await _COUNTRIES_API.GET.getAll();
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let country = new CountryResponseDTO(json[i]);

                let option = document.createElement("option");
                option.value = country.getCode();
                option.textContent = country.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async changeFlag(selectElementCountriesObj) {
        if (selectElementCountriesObj) {
            let spanFlagElement = selectElementCountriesObj.getSpanFlagElement();
            if (spanFlagElement) {
                let countryName;
                let countryCode = selectElementCountriesObj.getSelectedValue();
                if (countryCode) {
                    let jsonResponse = await _COUNTRIES_API.GET.findByCode(countryCode);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        let country = new CountryResponseDTO(jsonResponse.getJson());

                        countryName = country.getTitle();
                        countryCode = country.getCode();
                    }
                }

                spanFlagElement.changeFlag(countryName, countryCode, true);
            }
        }
    }
}