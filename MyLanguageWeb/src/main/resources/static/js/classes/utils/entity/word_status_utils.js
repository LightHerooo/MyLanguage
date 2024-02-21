import {
    WordStatusResponseDTO
} from "../../dto/entity/word_status.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordStatusesAPI
} from "../../api/word_statuses/word_statuses_api.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

export class WordStatusUtils {
    async fillComboBox(cbWordStatuses, firstOption) {
        if (firstOption) {
            cbWordStatuses.appendChild(firstOption);
        }

        let jsonResponse = await _WORD_STATUSES_API.GET.getAll();
        if (jsonResponse.status === _HTTP_STATUSES.OK) {
            let json = jsonResponse.json;
            for (let i = 0; i < json.length; i++) {
                let wordStatus = new WordStatusResponseDTO(json[i]);

                let option = document.createElement("option");
                option.style.color = "#" + wordStatus.colorHexCode;
                option.textContent = wordStatus.title;
                option.id = wordStatus.code;

                cbWordStatuses.appendChild(option);
            }

            cbWordStatuses.addEventListener("change", function () {
                let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(this);
                this.style.backgroundColor = selectedOption.style.color;
            })
        }
    }
}