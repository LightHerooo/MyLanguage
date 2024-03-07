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
    async #fillClear(cbWordStatuses, firstOption) {
        if (cbWordStatuses) {
            cbWordStatuses.replaceChildren();

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
            }
        }
    }

    async prepare(cbWordStatuses, firstOption){
        if (cbWordStatuses) {
            await this.#fillClear(cbWordStatuses, firstOption);

            cbWordStatuses.addEventListener("change", function () {
                let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(this);
                this.style.backgroundColor = selectedOption.style.color;
            });
        }
    }

    async fill(cbWordStatuses, firstOption) {
        if (cbWordStatuses) {
            // Запоминаем, какой элемент был выбран до очистки списка ---
            let oldWordStatus = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbWordStatuses);
            //---

            await this.#fillClear(cbWordStatuses, firstOption);

            // Пытаемся установить старый элемент ---
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                cbWordStatuses, oldWordStatus, false);
            //---
        }
    }
}