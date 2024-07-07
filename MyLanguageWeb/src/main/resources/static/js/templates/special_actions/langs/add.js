import {
    InputTextElement
} from "../../../classes/html/input/text/input_text_element.js";

import {
    InputTextWithRuleElement
} from "../../../classes/html/input/text/input_text_with_rule_element.js";

import {
    InputTextWithRuleElementLangTitleAdd
} from "../../../classes/html/input/text/entity/lang/title/input_text_with_rule_element_lang_title_add.js";

import {
    SelectWithRuleElementCountries
} from "../../../classes/html/select/entity/country/select_with_rule_element_countries.js";

import {
    FormElementLangAdd
} from "../../../classes/html/form/entity/lang/form_element_lang_add.js";

import {
    UrlUtils
} from "../../../classes/url/url_utils.js";

const _URL_UTILS = new UrlUtils();

// Элементы формы + форма "Новый язык" ---
let _inputTextWithRuleElementLangTitleAdd;
let _selectWithRuleElementCountries;

let _formElementLangAdd;
//---

let _currentLangCode;

window.onload = async function() {
    // Пытаемся получить текущий код языка ---
    tryToGetCurrentLangCode();
    //---

    // Элементы формы + форма "Новый язык" ---
    prepareInputTextWithRuleElementLangTitle();
    await prepareSelectWithRuleElementCountries();
    await prepareFormElementLangAdd();
    //---

    if (_formElementLangAdd) {
        _formElementLangAdd.changeDisabledStatusToFormElements(false);
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

// Элементы формы + форма "Новый язык" ---
function prepareInputTextWithRuleElementLangTitle() {
    let inputText = document.getElementById("input_text_lang_title");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementLangTitleAdd = new InputTextWithRuleElementLangTitleAdd(inputTextWithRuleElement);

        _inputTextWithRuleElementLangTitleAdd.prepare();
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

async function prepareFormElementLangAdd() {
    let form = document.getElementById("form_lang_add");
    let buttonSubmit = document.getElementById("button_submit_lang_add");
    let divMessageContainer = document.getElementById("div_message_container_lang_add");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementLangAdd = new FormElementLangAdd(form, buttonSubmit, divMessageContainer);
        _formElementLangAdd.setInputTextWithRuleElementLangTitleAdd(_inputTextWithRuleElementLangTitleAdd);
        _formElementLangAdd.setSelectWithRuleElementCountries(_selectWithRuleElementCountries);
        _formElementLangAdd.setLangCode(_currentLangCode);

        await _formElementLangAdd.prepare();
    }
}
//---