import {
    FormElementRegistration
} from "../../classes/html/form/entity/customer/form_element_registration.js";

import {
    InputTextWithRuleElementCustomerNickname
} from "../../classes/html/input/text/entity/customer/input_text_with_rule_element_customer_nickname.js";

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

// Элементы формы + форма ---
let _inputTextWithRuleElementCustomerNickname;
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
    prepareInputTextWithRuleElementCustomerNickname();
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

function prepareInputTextWithRuleElementCustomerNickname() {
    let inputText = document.getElementById("input_text_nickname");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextWithRuleElementCustomerNickname = new InputTextWithRuleElementCustomerNickname(inputTextElement);
        _inputTextWithRuleElementCustomerNickname.prepare();
    }
}

async function prepareSelectWithRuleElementCountries() {
    let divContainer = document.getElementById("div_select_countries");
    let select = document.getElementById("select_countries");
    let spanFlag = document.getElementById("span_flag_select_countries");
    if (divContainer && select && spanFlag) {
        _selectWithRuleElementCountries = new SelectWithRuleElementCountries(
            divContainer, select, spanFlag, true);
        _selectWithRuleElementCountries.prepare();
        await _selectWithRuleElementCountries.fill();
    }
}

function prepareInputTextWithRuleElementCustomerEmail() {
    let inputText = document.getElementById("input_text_email");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);

        _inputTextWithRuleElementCustomerEmail = new InputTextWithRuleElementCustomerEmail(inputTextElement);
        _inputTextWithRuleElementCustomerEmail.prepare();
    }
}

function prepareInputTextWithRuleElementCustomerLogin() {
    let inputText = document.getElementById("input_text_login");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);

        _inputTextWithRuleElementCustomerLogin = new InputTextWithRuleElementCustomerLogin(inputTextElement);
        _inputTextWithRuleElementCustomerLogin.prepare();
    }
}

function prepareInputPasswordWithRuleElementCustomerPassword() {
    let inputPassword = document.getElementById("input_password");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);

        _inputPasswordWithRuleElementCustomerPassword = new InputPasswordWithRuleElementCustomerPassword(
            inputPasswordElement);
        _inputPasswordWithRuleElementCustomerPassword.prepare();
    }
}

function prepareInputPasswordWithRuleElementRepeat() {
    let inputPassword = document.getElementById("input_password_repeat");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);

        _inputPasswordWithRuleElementRepeat = new InputPasswordWithRuleElementRepeat(
            inputPasswordElement);
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
        _formElementRegistration.setInputTextWithRuleElementCustomerNickname(_inputTextWithRuleElementCustomerNickname);
        _formElementRegistration.setSelectWithRuleElementCountries(_selectWithRuleElementCountries);
        _formElementRegistration.setInputTextWithRuleElementCustomerEmail(_inputTextWithRuleElementCustomerEmail);
        _formElementRegistration.setInputTextWithRuleElementCustomerLogin(_inputTextWithRuleElementCustomerLogin);
        _formElementRegistration.setInputPasswordWithRuleElementCustomerPassword(_inputPasswordWithRuleElementCustomerPassword);
        _formElementRegistration.setInputPasswordWithRuleElementRepeat(_inputPasswordWithRuleElementRepeat);
        _formElementRegistration.setInputCheckboxElementShowPassword(_inputCheckboxElementShowPassword);
        await _formElementRegistration.prepare();
    }
}