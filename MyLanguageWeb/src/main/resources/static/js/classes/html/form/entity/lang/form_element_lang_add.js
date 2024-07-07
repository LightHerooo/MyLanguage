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
    LangAddRequestDTO
} from "../../../../dto/entity/lang/request/lang_add_request_dto.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

const _LANGS_API = new LangsAPI();

const _EVENT_NAMES = new EventNames();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class FormElementLangAdd extends FormAbstractElement {
    #inputTextWithRuleElementLangTitleAdd;
    #selectWithRuleElementCountries;
    #langCode;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputTextWithRuleElementLangTitleAdd(inputTextWithRuleElementLangTitleAddObj) {
        this.#inputTextWithRuleElementLangTitleAdd = inputTextWithRuleElementLangTitleAddObj;
    }

    setSelectWithRuleElementCountries(selectWithRuleElementCountriesObj) {
        this.#selectWithRuleElementCountries = selectWithRuleElementCountriesObj;
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }


    async prepare() {
        await super.prepare();

        let inputTextWithRuleElementLangTitleAdd = this.#inputTextWithRuleElementLangTitleAdd;
        if (inputTextWithRuleElementLangTitleAdd) {
            if (!inputTextWithRuleElementLangTitleAdd.getIsPrepared()) {
                inputTextWithRuleElementLangTitleAdd.prepare();
            }

            let inputText = inputTextWithRuleElementLangTitleAdd.getInputText();
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

            let select = selectWithRuleElementCountries.getSelect();
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
        let inputTextWithRuleElementLangTitleAdd = this.#inputTextWithRuleElementLangTitleAdd;
        if (inputTextWithRuleElementLangTitleAdd) {
            isTitleCorrect = await inputTextWithRuleElementLangTitleAdd.checkCorrectValue();
        }

        let isCountryCodeCorrect = false;
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            isCountryCodeCorrect = await selectWithRuleElementCountries.checkCorrectValue();
        }

        return isLangCodeCorrect && isTitleCorrect && isCountryCodeCorrect;
    }

    async submit() {
        let dto = new LangAddRequestDTO();

        // Код языка ---
        dto.setLangCode(this.#langCode);
        //---

        // Название ---
        let inputTextWithRuleElementLangTitleAdd = this.#inputTextWithRuleElementLangTitleAdd;
        if (inputTextWithRuleElementLangTitleAdd) {
            dto.setTitle(inputTextWithRuleElementLangTitleAdd.getValue());
        }
        //---

        // Код страны ---
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            dto.setCountryCode(selectWithRuleElementCountries.getSelectedValue());
        }
        //---

        // Пытаемся создать новый язык ---
        let isCorrect = true;
        let ruleType;
        let message;

        let jsonResponse = await _LANGS_API.POST.add(dto);
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

        let inputTextWithRuleElementLangTitleAdd = this.#inputTextWithRuleElementLangTitleAdd;
        if (inputTextWithRuleElementLangTitleAdd) {
            inputTextWithRuleElementLangTitleAdd.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            selectWithRuleElementCountries.changeDisabledStatus(isDisabled);
        }
    }
}