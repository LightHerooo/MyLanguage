import {
    FormElementRegistration
} from "../../classes/html/form/entity/customer/form_element_registration.js";

import {
    InputTextWithRuleElementCustomerNicknameAdd
} from "../../classes/html/input/text/entity/customer/nickname/input_text_with_rule_element_customer_nickname_add.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    SelectWithRuleElementCountries
} from "../../classes/html/select/entity/country/select_with_rule_element_countries.js";

import {
    InputTextWithRuleElementCustomerEmail
} from "../../classes/html/input/text/entity/customer/input_text_with_rule_element_customer_email.js";

import {
    InputTextWithRuleElementCustomerLogin
} from "../../classes/html/input/text/entity/customer/input_text_with_rule_element_customer_login.js";

import {
    InputPasswordElement
} from "../../classes/html/input/password/input_password_element.js";

import {
    InputPasswordWithRuleElementCustomerPassword
} from "../../classes/html/input/password/entity/customer/input_password_with_rule_element_customer.js";

import {
    InputPasswordWithRuleElementRepeat
} from "../../classes/html/input/password/elements/input_password_with_rule_element_repeat.js";

import {
    InputCheckboxElement
} from "../../classes/html/input/checkbox/input_checkbox_element.js";

import {
    InputCheckboxElementShowPassword
} from "../../classes/html/input/checkbox/elements/input_checkbox_element_show_password.js";

import {
    InputTextWithRuleElement
} from "../../classes/html/input/text/input_text_with_rule_element.js";

import {
    InputPasswordWithRuleElement
} from "../../classes/html/input/password/input_password_with_rule_element.js";

// Элементы формы + форма ---
let _inputTextWithRuleElementCustomerNicknameAdd;
let _selectWithRuleElementCountries;
let _inputTextWithRuleElementCustomerEmail;
let _inputTextWithRuleElementCustomerLogin;
let _inputPasswordWithRuleElementCustomerPassword;
let _inputPasswordWithRuleElementRepeat;
let _inputCheckboxElementShowPassword;

let _formElementRegistration;
//---

window.onload = async function () {
    // Элементы формы + форма ---
    prepareInputTextWithRuleElementCustomerNicknameAdd();
    await prepareSelectWithRuleElementCountries();
    prepareInputTextWithRuleElementCustomerEmail();
    prepareInputTextWithRuleElementCustomerLogin();
    prepareInputPasswordWithRuleElementCustomerPassword();
    prepareInputPasswordWithRuleElementRepeat();
    prepareInputCheckboxElementShowPassword();

    await prepareFormElementRegistration();
    //---

    if (_formElementRegistration) {
        _formElementRegistration.changeDisabledStatusToFormElements(false);
    }
};

window.onbeforeunload = async function () {

}

function prepareInputTextWithRuleElementCustomerNicknameAdd() {
    let inputText = document.getElementById("input_text_nickname");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementCustomerNicknameAdd = new InputTextWithRuleElementCustomerNicknameAdd(inputTextWithRuleElement);
        _inputTextWithRuleElementCustomerNicknameAdd.prepare();
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

function prepareInputTextWithRuleElementCustomerEmail() {
    let inputText = document.getElementById("input_text_email");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementCustomerEmail = new InputTextWithRuleElementCustomerEmail(inputTextWithRuleElement);
        _inputTextWithRuleElementCustomerEmail.prepare();
    }
}

function prepareInputTextWithRuleElementCustomerLogin() {
    let inputText = document.getElementById("input_text_login");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementCustomerLogin = new InputTextWithRuleElementCustomerLogin(inputTextWithRuleElement);
        _inputTextWithRuleElementCustomerLogin.prepare();
    }
}

function prepareInputPasswordWithRuleElementCustomerPassword() {
    let inputPassword = document.getElementById("input_password");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);
        let inputPasswordWithRuleElement = new InputPasswordWithRuleElement(
            inputPasswordElement, true);
        _inputPasswordWithRuleElementCustomerPassword = new InputPasswordWithRuleElementCustomerPassword(
            inputPasswordWithRuleElement);
        _inputPasswordWithRuleElementCustomerPassword.prepare();
    }
}

function prepareInputPasswordWithRuleElementRepeat() {
    let inputPassword = document.getElementById("input_password_repeat");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);
        let inputPasswordWithRuleElement = new InputPasswordWithRuleElement(
            inputPasswordElement, true);
        _inputPasswordWithRuleElementRepeat = new InputPasswordWithRuleElementRepeat(inputPasswordWithRuleElement);
        _inputPasswordWithRuleElementRepeat.setFirstInputPasswordElement(_inputPasswordWithRuleElementCustomerPassword);
        _inputPasswordWithRuleElementRepeat.prepare();
    }
}

function prepareInputCheckboxElementShowPassword() {
    let divContainer = document.getElementById("div_input_checkbox_show_password");
    let inputCheckbox = document.getElementById("input_checkbox_show_password");
    let label = document.getElementById("label_input_checkbox_show_password");
    if (divContainer && inputCheckbox && label) {
        let inputCheckboxElement = new InputCheckboxElement(divContainer, inputCheckbox, label);

        _inputCheckboxElementShowPassword = new InputCheckboxElementShowPassword(inputCheckboxElement,
            [_inputPasswordWithRuleElementCustomerPassword, _inputPasswordWithRuleElementRepeat]);
        _inputCheckboxElementShowPassword.prepare();
    }
}

async function prepareFormElementRegistration() {
    let form = document.getElementById("form_registration");
    let buttonSubmit = document.getElementById("button_submit_registration");
    let divMessageContainer = document.getElementById("div_message_container_registration");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementRegistration = new FormElementRegistration(form, buttonSubmit, divMessageContainer);
        _formElementRegistration.setInputTextWithRuleElementCustomerNicknameAdd(_inputTextWithRuleElementCustomerNicknameAdd);
        _formElementRegistration.setSelectWithRuleElementCountries(_selectWithRuleElementCountries);
        _formElementRegistration.setInputTextWithRuleElementCustomerEmail(_inputTextWithRuleElementCustomerEmail);
        _formElementRegistration.setInputTextWithRuleElementCustomerLogin(_inputTextWithRuleElementCustomerLogin);
        _formElementRegistration.setInputPasswordWithRuleElementCustomerPassword(_inputPasswordWithRuleElementCustomerPassword);
        _formElementRegistration.setInputPasswordWithRuleElementRepeat(_inputPasswordWithRuleElementRepeat);
        _formElementRegistration.setInputCheckboxElementShowPassword(_inputCheckboxElementShowPassword);
        await _formElementRegistration.prepare();
    }
}