import {
    UrlUtils
} from "../../../classes/url/url_utils.js";

import {
    InputTextElement
} from "../../../classes/html/input/text/input_text_element.js";

import {
    InputTextWithRuleElement
} from "../../../classes/html/input/text/input_text_with_rule_element.js";

import {
    InputTextWithRuleElementLangTitleEdit
} from "../../../classes/html/input/text/entity/lang/title/input_text_with_rule_element_lang_title_edit.js";

import {
    SelectWithRuleElementCountries
} from "../../../classes/html/select/entity/country/select_with_rule_element_countries.js";

import {
    SelectWithRuleElementBoolean
} from "../../../classes/html/select/elements/boolean/select_with_rule_element_boolean.js";

import {
    FormElementLangEdit
} from "../../../classes/html/form/entity/lang/form_element_lang_edit.js";

const _URL_UTILS = new UrlUtils();

// Элементы формы + форма "Изменение языка" ---
let _inputTextWithRuleElementLangTitleEdit;
let _selectWithRuleElementCountries;
let _selectWithRuleElementBooleanIsActiveForIn;
let _selectWithRuleElementBooleanIsActiveForOut;

let _formElementLangEdit;
//---

let _currentLangCode;

window.onload = async function () {
    // Пытаемся получить текущий код языка ---
    tryToGetCurrentLangCode();
    //---

    // Элементы формы + форма "Изменение языка" ---
    prepareInputTextWithRuleElementLangTitleEdit();
    await prepareSelectWithRuleElementCountries();
    await prepareSelectWithRuleElementBooleanIsActiveForIn();
    await prepareSelectWithRuleElementBooleanIsActiveForOut();

    await prepareFormElementLangEdit();
    //---

    if (_formElementLangEdit) {
        _formElementLangEdit.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

function tryToGetCurrentLangCode() {
    let pathVariable = _URL_UTILS.getPathVariable();
    if (pathVariable) {
        _currentLangCode = pathVariable;
    }
}

// Элементы формы + форма "Изменение языка" ---
function prepareInputTextWithRuleElementLangTitleEdit() {
    let inputText = document.getElementById("input_text_lang_title");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementLangTitleEdit = new InputTextWithRuleElementLangTitleEdit(inputTextWithRuleElement);
        _inputTextWithRuleElementLangTitleEdit.setLangCode(_currentLangCode);

        _inputTextWithRuleElementLangTitleEdit.prepare();
    }
}

async function prepareSelectWithRuleElementCountries() {
    let divContainer = document.getElementById("div_select_countries");
    let select = document.getElementById("select_countries");
    let spanFlag = document.getElementById("span_flag_select_countries");
    if (divContainer && select && spanFlag) {
        _selectWithRuleElementCountries = new SelectWithRuleElementCountries(
            divContainer, select, spanFlag, true, true);

        _selectWithRuleElementCountries.prepare();
        await _selectWithRuleElementCountries.fill();
    }
}

async function prepareSelectWithRuleElementBooleanIsActiveForIn() {
    let select = document.getElementById("select_is_active_for_in");
    if (select) {
        _selectWithRuleElementBooleanIsActiveForIn = new SelectWithRuleElementBoolean(
            select, true, true);

        _selectWithRuleElementBooleanIsActiveForIn.prepare();
        await _selectWithRuleElementBooleanIsActiveForIn.fill();
    }
}

async function prepareSelectWithRuleElementBooleanIsActiveForOut() {
    let select = document.getElementById("select_is_active_for_out");
    if (select) {
        _selectWithRuleElementBooleanIsActiveForOut = new SelectWithRuleElementBoolean(
            select, true, true);

        _selectWithRuleElementBooleanIsActiveForOut.prepare();
        await _selectWithRuleElementBooleanIsActiveForOut.fill();
    }
}

async function prepareFormElementLangEdit() {
    let form = document.getElementById("form_lang_edit");
    let buttonSubmit = document.getElementById("button_submit_lang_edit");
    let divMessageContainer = document.getElementById("div_message_container_lang_edit");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementLangEdit = new FormElementLangEdit(form, buttonSubmit, divMessageContainer);
        _formElementLangEdit.setLangCode(_currentLangCode);
        _formElementLangEdit.setInputTextWithRuleElementLangTitleEdit(_inputTextWithRuleElementLangTitleEdit);
        _formElementLangEdit.setSelectWithRuleElementCountries(_selectWithRuleElementCountries);
        _formElementLangEdit.setSelectWithRuleElementBooleanIsActiveForIn(_selectWithRuleElementBooleanIsActiveForIn);
        _formElementLangEdit.setSelectWithRuleElementBooleanIsActiveForOut(_selectWithRuleElementBooleanIsActiveForOut);

        await _formElementLangEdit.prepare();
    }
}
//---

