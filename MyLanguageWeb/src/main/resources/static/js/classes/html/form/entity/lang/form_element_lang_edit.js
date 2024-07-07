import {
    FormAbstractElement
} from "../../abstracts/form_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    LangsAPI
} from "../../../../api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    LangEditRequestDTO
} from "../../../../dto/entity/lang/request/lang_edit_request_dto.js";

import {
    LangResponseDTO
} from "../../../../dto/entity/lang/response/lang_response_dto.js";

const _LANGS_API = new LangsAPI();

const _EVENT_NAMES = new EventNames();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class FormElementLangEdit extends FormAbstractElement {
    #inputTextWithRuleElementLangTitleEdit;
    #selectWithRuleElementCountries;
    #selectWithRuleElementBooleanIsActiveForIn;
    #selectWithRuleElementBooleanIsActiveForOut;
    #langCode;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputTextWithRuleElementLangTitleEdit(inputTextWithRuleElementLangTitleEditObj) {
        this.#inputTextWithRuleElementLangTitleEdit = inputTextWithRuleElementLangTitleEditObj;
    }

    setSelectWithRuleElementCountries(selectWithRuleElementCountriesObj) {
        this.#selectWithRuleElementCountries = selectWithRuleElementCountriesObj;
    }

    setSelectWithRuleElementBooleanIsActiveForIn(selectWithRuleElementBooleanIsActiveForInObj) {
        this.#selectWithRuleElementBooleanIsActiveForIn = selectWithRuleElementBooleanIsActiveForInObj;
    }

    setSelectWithRuleElementBooleanIsActiveForOut(selectWithRuleElementBooleanIsActiveForOutObj) {
        this.#selectWithRuleElementBooleanIsActiveForOut = selectWithRuleElementBooleanIsActiveForOutObj;
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }


    async prepare() {
        await super.prepare();

        // Находим язык ---
        let langResponseDTO;
        let langCode = this.#langCode;
        if (langCode) {
            let jsonResponse = await _LANGS_API.GET.findByCode(langCode);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                langResponseDTO = new LangResponseDTO(jsonResponse.getJson());
            }
        }
        //---

        let inputTextWithRuleElementLangTitleEdit = this.#inputTextWithRuleElementLangTitleEdit;
        if (inputTextWithRuleElementLangTitleEdit) {
            if (!inputTextWithRuleElementLangTitleEdit.getIsPrepared()) {
                inputTextWithRuleElementLangTitleEdit.prepare();
            }

            if (langResponseDTO) {
                inputTextWithRuleElementLangTitleEdit.changeValue(langResponseDTO.getTitle(), true);
            }

            let inputText = inputTextWithRuleElementLangTitleEdit.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            if (!selectWithRuleElementCountries.getIsPrepared()) {
                selectWithRuleElementCountries.prepare();
                await selectWithRuleElementCountries.fill();
            }

            if (langResponseDTO) {
                let country = langResponseDTO.getCountry();
                if (country) {
                    selectWithRuleElementCountries.changeSelectedOptionByValue(country.getCode(), true);
                }

            }

            let select = selectWithRuleElementCountries.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementBooleanIsActiveForIn = this.#selectWithRuleElementBooleanIsActiveForIn;
        if (selectWithRuleElementBooleanIsActiveForIn) {
            if (!selectWithRuleElementBooleanIsActiveForIn.getIsPrepared()) {
                selectWithRuleElementBooleanIsActiveForIn.prepare();
                await selectWithRuleElementBooleanIsActiveForIn.fill();
            }

            if (langResponseDTO) {
                selectWithRuleElementBooleanIsActiveForIn.changeSelectedOptionByValue(
                    langResponseDTO.getIsActiveForIn(), true);
            }

            let select = selectWithRuleElementBooleanIsActiveForIn.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementBooleanIsActiveForOut = this.#selectWithRuleElementBooleanIsActiveForOut;
        if (selectWithRuleElementBooleanIsActiveForOut) {
            if (!selectWithRuleElementBooleanIsActiveForOut.getIsPrepared()) {
                selectWithRuleElementBooleanIsActiveForOut.prepare();
                await selectWithRuleElementBooleanIsActiveForOut.fill();
            }

            if (langResponseDTO) {
                selectWithRuleElementBooleanIsActiveForOut.changeSelectedOptionByValue(
                    langResponseDTO.getIsActiveForOut(), true);
            }

            let select = selectWithRuleElementBooleanIsActiveForOut.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }
    }

    async checkCorrectValues() {
        let isLangCodeCorrect = false;
        let langCode = this.#langCode;
        if (langCode) {
            isLangCodeCorrect = true;
        }

        let isTitleCorrect = false;
        let inputTextWithRuleElementLangTitleEdit = this.#inputTextWithRuleElementLangTitleEdit;
        if (inputTextWithRuleElementLangTitleEdit) {
            isTitleCorrect = await inputTextWithRuleElementLangTitleEdit.checkCorrectValue();
        }

        let isCountryCodeCorrect = false;
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            isCountryCodeCorrect = await selectWithRuleElementCountries.checkCorrectValue();
        }

        let isActiveForInCorrect = false;
        let selectWithRuleElementBooleanIsActiveForIn = this.#selectWithRuleElementBooleanIsActiveForIn;
        if (selectWithRuleElementBooleanIsActiveForIn) {
            isActiveForInCorrect = await selectWithRuleElementBooleanIsActiveForIn.checkCorrectValue();
        }

        let isActiveForOutCorrect = false;
        let selectWithRuleElementBooleanIsActiveForOut = this.#selectWithRuleElementBooleanIsActiveForOut;
        if (selectWithRuleElementBooleanIsActiveForOut) {
            isActiveForOutCorrect = await selectWithRuleElementBooleanIsActiveForOut.checkCorrectValue();
        }

        return isLangCodeCorrect && isTitleCorrect && isCountryCodeCorrect && isActiveForInCorrect && isActiveForOutCorrect;
    }

    async submit() {
        let dto = new LangEditRequestDTO();

        // Код языка ---
        dto.setLangCode(this.#langCode);
        //---

        // Название ---
        let inputTextWithRuleElementLangTitleEdit = this.#inputTextWithRuleElementLangTitleEdit;
        if (inputTextWithRuleElementLangTitleEdit) {
            dto.setTitle(inputTextWithRuleElementLangTitleEdit.getValue());
        }
        //---

        // Код страны ---
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            dto.setCountryCode(selectWithRuleElementCountries.getSelectedValue());
        }
        //---

        // Активен на вход ---
        let selectWithRuleElementBooleanIsActiveForIn = this.#selectWithRuleElementBooleanIsActiveForIn;
        if (selectWithRuleElementBooleanIsActiveForIn) {
            dto.setIsActiveForIn(selectWithRuleElementBooleanIsActiveForIn.getSelectedValue());
        }
        //---

        // Активен на выход ---
        let selectWithRuleElementBooleanIsActiveForOut = this.#selectWithRuleElementBooleanIsActiveForOut;
        if (selectWithRuleElementBooleanIsActiveForOut) {
            dto.setIsActiveForOut(selectWithRuleElementBooleanIsActiveForOut.getSelectedValue());
        }
        //---

        // Пытаемся изменить язык ---
        let isCorrect = true;
        let ruleType;
        let message;

        let jsonResponse = await _LANGS_API.PATCH.edit(dto);
        if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
        }
        //---

        if (!isCorrect) {
            this.showRule(ruleType, message);
        }

        return isCorrect;
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let inputTextWithRuleElementLangTitleEdit = this.#inputTextWithRuleElementLangTitleEdit;
        if (inputTextWithRuleElementLangTitleEdit) {
            inputTextWithRuleElementLangTitleEdit.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            selectWithRuleElementCountries.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementBooleanIsActiveForIn = this.#selectWithRuleElementBooleanIsActiveForIn;
        if (selectWithRuleElementBooleanIsActiveForIn) {
            selectWithRuleElementBooleanIsActiveForIn.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementBooleanIsActiveForOut = this.#selectWithRuleElementBooleanIsActiveForOut;
        if (selectWithRuleElementBooleanIsActiveForOut) {
            selectWithRuleElementBooleanIsActiveForOut.changeDisabledStatus(isDisabled);
        }
    }
}