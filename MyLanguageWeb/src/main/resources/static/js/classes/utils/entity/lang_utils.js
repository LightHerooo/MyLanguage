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

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _FLAG_ELEMENTS = new FlagElements();

export class LangUtils {
    CB_LANGS_IN = new CbLangsIn();
    CB_LANGS_OUT = new CbLangsOut();

    async changeCbLangsItemByLangCode(comboBoxWithFlagObj, langCode) {
        if (comboBoxWithFlagObj) {
            let cbLangs = comboBoxWithFlagObj.comboBox;
            if (cbLangs) {
                if (langCode) {
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                        cbLangs, langCode, false);
                } else {
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
                        cbLangs, 0, false);
                }

                let generalFunctions = new CbLangsGeneralFunctions();
                await generalFunctions.changeFlag(comboBoxWithFlagObj);
            }
        }
    }
}

class CbLangsIn {
    async prepare(comboBoxWithFlagObj, firstOption, doNeedValueChecker) {
        // Подготавливаем функцию API ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForIn;
        //---

        // Если нам нужны проверки, создаём функцию ---
        let checkCorrectValuePreparedFunction;
        if (doNeedValueChecker === true) {
            checkCorrectValuePreparedFunction = this.checkCorrectValue;
        }
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.prepare(comboBoxWithFlagObj, firstOption,
            getAllLangsAPIFunction, checkCorrectValuePreparedFunction);
    }

    async fill(comboBoxWithFlagObj, firstOption){
        // Подготавливаем функцию API ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForIn;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.fill(comboBoxWithFlagObj, firstOption, getAllLangsAPIFunction);
    }

    async fillByLangOutCode(comboBoxWithFlagObj, firstOption, langOutCode){
        // Подготавливаем функцию API получения всех языков ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForIn;
        //---

        // Подготавливаем функцию API получения всех языков по коду ---
        let getAllLangsByCodeAPIFunction = _LANGS_API.GET.getAllForInByLangOutCode;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.fillByLangCode(comboBoxWithFlagObj, firstOption, langOutCode,
            getAllLangsAPIFunction,
            getAllLangsByCodeAPIFunction);
    }

    async checkCorrectValue(comboBoxWithFlagObj){
        // Подготавливаем функцию API проверки значения ---
        let validateIsActiveByCodeFunction = _LANGS_API.GET.validateIsActiveForInByCode;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        return await GENERAL_FUNCTIONS.checkCorrectValue(
            comboBoxWithFlagObj, validateIsActiveByCodeFunction);
    }
}

class CbLangsOut {
    async prepare(comboBoxWithFlagObj, firstOption, doNeedValueChecker) {
        // Подготавливаем функцию API ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForOut;
        //---

        // Если нам нужны проверки, создаём функцию ---
        let checkCorrectValuePreparedFunction;
        if (doNeedValueChecker === true) {
            checkCorrectValuePreparedFunction = this.checkCorrectValue;
        }
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.prepare(comboBoxWithFlagObj, firstOption,
            getAllLangsAPIFunction, checkCorrectValuePreparedFunction);
    }

    async fill(comboBoxWithFlagObj, firstOption){
        // Подготавливаем функцию API ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForOut;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.fill(comboBoxWithFlagObj, firstOption, getAllLangsAPIFunction);
    }

    async fillByLangInCode(comboBoxWithFlagObj, firstOption, langInCode){
        // Подготавливаем функцию API получения всех языков ---
        let getAllLangsAPIFunction = _LANGS_API.GET.getAllForOut;
        //---

        // Подготавливаем функцию API получения всех языков по коду ---
        let getAllLangsByCodeAPIFunction = _LANGS_API.GET.getAllForOutByLangInCode;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        await GENERAL_FUNCTIONS.fillByLangCode(comboBoxWithFlagObj, firstOption, langInCode,
            getAllLangsAPIFunction,
            getAllLangsByCodeAPIFunction);
    }

    async checkCorrectValue(comboBoxWithFlagObj){
        // Подготавливаем функцию API проверки значения ---
        let validateIsActiveByCodeFunction = _LANGS_API.GET.validateIsActiveForOutByCode;
        //---

        const GENERAL_FUNCTIONS = new CbLangsGeneralFunctions();
        return await GENERAL_FUNCTIONS.checkCorrectValue(
            comboBoxWithFlagObj, validateIsActiveByCodeFunction);
    }
}

class CbLangsGeneralFunctions {
    async #fillWithClear(comboBoxWithFlagObj, firstOption, JSONResponseByLangsAPI){
        if (comboBoxWithFlagObj) {
            let cbLangs = comboBoxWithFlagObj.comboBox;
            if (cbLangs) {
                cbLangs.replaceChildren();

                if (firstOption) {
                    cbLangs.appendChild(firstOption);
                }

                if (JSONResponseByLangsAPI) {
                    if (JSONResponseByLangsAPI.status === _HTTP_STATUSES.OK) {
                        let json = JSONResponseByLangsAPI.json;
                        for (let i = 0; i < json.length; i++) {
                            let lang = new LangResponseDTO(json[i]);

                            let option = document.createElement("option");
                            option.id = lang.code;
                            option.textContent = lang.title;

                            cbLangs.appendChild(option);
                        }
                    }
                }
            }
        }
    }

    async changeFlag(comboBoxWithFlagObj) {
        if (comboBoxWithFlagObj) {
            let cbLangs = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbLangs && divFlag) {
                let langCode;
                let optionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
                let JSONResponse = await _LANGS_API.GET.findByCode(optionId);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    langCode = optionId;
                }

                _FLAG_ELEMENTS.DIV.setStyles(divFlag, langCode, true);
            }
        }
    }

    async prepare(comboBoxWithFlagObj, firstOption,
                  getAllLangsAPIFunction,
                  checkCorrectValuePreparedFunction) {
        if (comboBoxWithFlagObj) {
            let cbLangsContainer = comboBoxWithFlagObj.comboBoxWithFlagContainer;
            let cbLangs = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbLangsContainer && cbLangs && divFlag) {
                // Заполняем выпадающий список ---
                await this.#fillWithClear(comboBoxWithFlagObj, firstOption, await getAllLangsAPIFunction());
                //---

                // Меняем флаг ---
                await this.changeFlag(comboBoxWithFlagObj);
                //---

                // Вешаем событие изменения флага ---
                let thisClass = this;
                cbLangs.addEventListener("change", async function () {
                    await thisClass.changeFlag(comboBoxWithFlagObj);
                });
                //---

                // Вешаем событие проверки (если оно необходимо) ---
                if (checkCorrectValuePreparedFunction) {
                    cbLangs.addEventListener("change", async function() {
                        checkCorrectValuePreparedFunction(comboBoxWithFlagObj);
                    });
                }
                //---
            }
        }
    }

    async fill(comboBoxWithFlagObj, firstOption, getAllLangsAPIFunction) {
        if (comboBoxWithFlagObj) {
            let cbLangs = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbLangs && divFlag) {
                // Запоминаем, какой элемент был выбран до очистки списка ---
                let oldLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
                //---

                await this.#fillWithClear(comboBoxWithFlagObj, firstOption, await getAllLangsAPIFunction());

                // Пытаемся установить старый элемент ---
                _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                    cbLangs, oldLangCode, false);
                //---

                // Меняем флаг ---
                await this.changeFlag(comboBoxWithFlagObj);
                //---
            }
        }
    }

    async fillByLangCode(comboBoxWithFlagObj, firstOption, langCode,
                         getAllLangsAPIFunction,
                         getAllLangsByCodeAPIFunction) {
        if (comboBoxWithFlagObj) {
            let cbLangs = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbLangs && divFlag) {
                // Запоминаем, какой элемент был выбран до очистки списка ---
                let oldLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
                //---

                // Заполняем выпадающий список на основе пришедшего кода языка ---
                let isLangCodeCorrect = false;
                if (langCode) {
                    let JSONResponse =  await getAllLangsByCodeAPIFunction(langCode);
                    if (JSONResponse.status === _HTTP_STATUSES.OK) {
                        isLangCodeCorrect = true;
                        await this.#fillWithClear(comboBoxWithFlagObj, firstOption, JSONResponse);
                    }
                }

                if (isLangCodeCorrect === true) {
                    // Пытаемся установить старый элемент ---
                    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
                        cbLangs, oldLangCode, false);
                    //---

                    // Меняем флаг ---
                    await this.changeFlag(comboBoxWithFlagObj);
                    //---

                } else {
                    // Если код был пустой или недопустимый, заполняем всеми значениями ---
                    await this.fill(comboBoxWithFlagObj, firstOption, getAllLangsAPIFunction);
                    //---
                }
            }
        }
    }

    async checkCorrectValue(comboBoxWithFlagObj, validateIsActiveByCodeFunction) {
        let isCorrect = false;
        if (comboBoxWithFlagObj) {
            let cbLangsContainer = comboBoxWithFlagObj.comboBoxWithFlagContainer;
            let cbLangs = comboBoxWithFlagObj.comboBox;
            let divFlag = comboBoxWithFlagObj.divFlag;
            if (cbLangsContainer && cbLangs && divFlag) {
                let ruleElement = new RuleElement(cbLangs, cbLangsContainer);

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
                        JSONResponse = await validateIsActiveByCodeFunction(langCode);
                        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                            isCorrect = false;
                            ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                            ruleElement.ruleType = _RULE_TYPES.ERROR;
                        } else {
                            isCorrect = true;
                        }
                        //---
                    }
                    //---
                } else {
                    isCorrect = false;
                    ruleElement.message = "Выберите язык.";
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }

                if (isCorrect === false) {
                    ruleElement.showRule();
                } else {
                    ruleElement.removeRule();
                }
            }
        }

        return isCorrect;
    }
}