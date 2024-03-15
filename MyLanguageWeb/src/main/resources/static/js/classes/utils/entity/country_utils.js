import {
    CountriesAPI
} from "../../api/countries_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CountryResponseDTO
} from "../../dto/entity/country.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

const _COUNTRIES_API = new CountriesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _FLAG_ELEMENTS = new FlagElements();
const _RULE_TYPES = new RuleTypes();

export class CountryUtils {
    CB_COUNTRIES = new CbCountries();
}

class CbCountries {
    async changeFlag(comboBoxWithFlagObj) {
        let cbCountries = comboBoxWithFlagObj.comboBox;
        let divFlag = comboBoxWithFlagObj.divFlag;
        if (cbCountries && divFlag) {
            let countryCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCountries);

            let country;
            let JSONResponse = await _COUNTRIES_API.GET.findByCode(countryCode);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                country = new CountryResponseDTO(JSONResponse.json);
            }

            _FLAG_ELEMENTS.DIV.setStyles(divFlag, country, true);
        }
    }

    async prepare(comboBoxWithFlag, firstOption, doNeedValueChecker) {
        if (comboBoxWithFlag) {
            let divCountryContainer = comboBoxWithFlag.comboBoxWithFlagContainer;
            let cbCountries = comboBoxWithFlag.comboBox;
            let divFlag = comboBoxWithFlag.divFlag;
            if (divCountryContainer && cbCountries && divFlag) {
                cbCountries.replaceChildren();

                if (firstOption) {
                    firstOption.value = "";
                    cbCountries.appendChild(firstOption);
                }

                let JSONResponse = await _COUNTRIES_API.GET.getAll();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let json = JSONResponse.json;
                    for (let i = 0; i < json.length; i++) {
                        let country = new CountryResponseDTO(json[i]);

                        let option = document.createElement("option");
                        option.value = country.code;
                        option.textContent = country.title;

                        cbCountries.appendChild(option);
                    }
                }

                // Меняем флаг ---
                await this.changeFlag(comboBoxWithFlag);
                //---

                // Вешаем событие изменения флага ---
                let thisClass = this;
                cbCountries.addEventListener("change", async function() {
                    await thisClass.changeFlag(comboBoxWithFlag);
                });
                //---

                if (doNeedValueChecker === true) {
                    cbCountries.addEventListener("change", async function() {
                        await thisClass.checkCorrectValue(comboBoxWithFlag);
                    });
                }
            }
        }
    }

    async checkCorrectValue(comboBoxWithFlag){
        let isCorrect = false;
        if (comboBoxWithFlag) {
            let divCountryContainer = comboBoxWithFlag.comboBoxWithFlagContainer;
            let cbCountries = comboBoxWithFlag.comboBox;
            if (divCountryContainer && cbCountries) {
                let ruleElement = new RuleElement(cbCountries, divCountryContainer);

                let countryCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbCountries);
                if (countryCode) {
                    let JSONResponse = await _COUNTRIES_API.GET.findByCode(countryCode);
                    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                        isCorrect = false;
                        ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                        ruleElement.ruleType = _RULE_TYPES.ERROR;
                    } else {
                        isCorrect = true;
                    }
                } else {
                    isCorrect = false;
                    ruleElement.message = "Выберите страну";
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