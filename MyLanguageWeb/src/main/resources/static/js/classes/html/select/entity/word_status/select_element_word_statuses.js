import {
    SelectAbstractElement
} from "../../abstracts/select_abstract_element.js";

import {
    WordStatusesAPI
} from "../../../../api/entity/word_statuses_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    WordStatusResponseDTO
} from "../../../../dto/entity/word_status/response/word_status_response_dto.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

const _HTTP_STATUSES = new HttpStatuses();

export class SelectElementWordStatuses extends SelectAbstractElement {

    constructor(select, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Все";

        return option;
    }

    async createOptionsArr() {
        let optionsArr = [];

        let jsonResponse = await _WORD_STATUSES_API.GET.getAll();
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let wordStatus = new WordStatusResponseDTO(json[i]);

                let option = document.createElement("option");
                let color = wordStatus.getColor();
                if (color) {
                    option.style.color = "#" + color.getHexCode();
                }
                option.value = wordStatus.getCode();
                option.textContent = wordStatus.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }
}