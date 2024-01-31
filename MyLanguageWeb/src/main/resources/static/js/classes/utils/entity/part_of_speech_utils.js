import {
    PartOfSpeechResponseDTO
} from "../../dto/part_of_speech.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    RuleElement,
    RuleTypes
} from "../../rule_element.js";

import {
    PartsOfSpeechAPI
} from "../../api/parts_of_speech_api.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

const _PARTS_OF_SPEECH_API = new PartsOfSpeechAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

export class PartOfSpeechUtils {
    async fillComboBox(cbPartsOfSpeech, firstOption) {
        if (firstOption) {
            cbPartsOfSpeech.appendChild(firstOption);
        }

        let JSONResponse = await _PARTS_OF_SPEECH_API.GET.getAll();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            for (let i = 0; i < json.length; i++) {
                let partOfSpeech = new PartOfSpeechResponseDTO(json[i]);

                let option = document.createElement("option");
                option.style.color = "#" + partOfSpeech.colorHexCode;
                option.textContent = partOfSpeech.title;
                option.id = partOfSpeech.code;

                cbPartsOfSpeech.appendChild(option);
            }

            cbPartsOfSpeech.addEventListener("change", function () {
                let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(this);
                this.style.backgroundColor = selectedOption.style.color;
            })
        }
    }

    async checkCorrectValueInComboBox(cbPartsOfSpeech, parentElement, isNullPartOfSpeechCodePossible) {
        let isCorrect = true;

        if (cbPartsOfSpeech && parentElement) {
            let message;
            let ruleType;

            let partOfSpeechCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbPartsOfSpeech);
            if (partOfSpeechCode) {
                let JSONResponse = await _PARTS_OF_SPEECH_API.GET.findByCode(partOfSpeechCode);
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleType = _RULE_TYPES.ERROR;
                }
            } else {
                if (isNullPartOfSpeechCodePossible === false) {
                    isCorrect = false;
                    message = "Выберите часть речи.";
                    ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            let ruleElement = new RuleElement(parentElement.id);
            if (isCorrect === false) {
                ruleElement.createOrChangeDiv(message, ruleType);
            } else {
                ruleElement.removeDiv();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }
}