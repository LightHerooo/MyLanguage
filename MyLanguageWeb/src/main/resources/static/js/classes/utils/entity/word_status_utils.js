import {
    WordStatusResponseDTO
} from "../../dto/entity/word_status/word_status.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordStatusesAPI
} from "../../api/word_statuses_api.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

export class WordStatusUtils {
    CB_WORD_STATUSES = new CbWordStatuses();
}

class CbWordStatuses {
    async prepare(cbWordStatuses, firstOption){
        if (cbWordStatuses) {
            cbWordStatuses.replaceChildren();

            if (firstOption) {
                firstOption.value = "";
                cbWordStatuses.appendChild(firstOption);
            }

            let jsonResponse = await _WORD_STATUSES_API.GET.getAll();
            if (jsonResponse.status === _HTTP_STATUSES.OK) {
                let json = jsonResponse.json;
                for (let i = 0; i < json.length; i++) {
                    let wordStatus = new WordStatusResponseDTO(json[i]);

                    let option = document.createElement("option");
                    let color = wordStatus.color;
                    if (color) {
                        option.style.color = "#" + color.hexCode;
                    }
                    option.value = wordStatus.code;
                    option.textContent = wordStatus.title;

                    cbWordStatuses.appendChild(option);
                }
            }

            cbWordStatuses.addEventListener("change", function () {
                let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(cbWordStatuses);
                cbWordStatuses.style.backgroundColor = selectedOption.style.color;
            });
        }
    }
}