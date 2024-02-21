import {
    LangResponseDTO
} from "../../dto/entity/lang.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    LangsAPI
} from "../../api/langs_api.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    CustomTimer
} from "../../custom_timer/custom_timer.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _FLAG_ELEMENTS = new FlagElements();

export class LangUtils {
    async prepareComboBox(cbLangs, firstOptional, divLangFlag) {
        if (firstOptional) {
            cbLangs.appendChild(firstOptional);
        }

        let JSONResponse = await _LANGS_API.GET.getAllActives();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            for (let i = 0; i < json.length; i++) {
                let lang = new LangResponseDTO(json[i]);

                let option = document.createElement("option");
                option.id = lang.code;
                option.textContent = lang.title;

                cbLangs.appendChild(option);
            }

            let customTimerLangFlagChanger = new CustomTimer();
            customTimerLangFlagChanger.timeout = 1;
            customTimerLangFlagChanger.handler = async function() {
                let langCode;
                let optionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
                let JSONResponse = await _LANGS_API.GET.findByCode(optionId);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    langCode = optionId;
                }

                _FLAG_ELEMENTS.DIV.setStyles(divLangFlag, langCode, true);
            }

            cbLangs.addEventListener("change", function () {
                customTimerLangFlagChanger.start();
            })

            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
                cbLangs, 0, true);
        }
    }

    async checkCorrectValueInComboBox(cbLangs, parentElement) {
        let isCorrect = true;

        if (cbLangs && parentElement) {
            let ruleElement = new RuleElement(cbLangs, parentElement);

            let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
            if (langCode) {
                // Ищем язык с указанным кодом ---
                let JSONResponse = await _LANGS_API.GET.findByCode(langCode);
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                } else {
                    // Проверяем, доступен ли язык с таким кодом ---
                    JSONResponse = await _LANGS_API.GET.validateIsActiveByCode(langCode);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    }
                    //---
                }
                //---
            } else {
                isCorrect = false;
                ruleElement.message = "Выберите язык.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }

    changeCbLangsItemByLangCode(cbLangs, langCode, doNeedToCallChangeEvent) {
        if (langCode) {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                cbLangs, langCode, doNeedToCallChangeEvent);
        } else {
            _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
                cbLangs, 0, doNeedToCallChangeEvent);
        }
    }
}