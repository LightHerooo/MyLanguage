import {
    FormElementEntry
} from "../../classes/html/form/entity/customer/form_element_entry.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputPasswordElement
} from "../../classes/html/input/password/input_password_element.js";

import {
    InputCheckboxElement
} from "../../classes/html/input/checkbox/input_checkbox_element.js";

import {
    InputCheckboxElementShowPassword
} from "../../classes/html/input/checkbox/elements/input_checkbox_element_show_password.js";

// Элементы формы + форма ---
let _inputTextElementLogin;
let _inputPasswordElement;
let _inputCheckboxElementShowPassword;

let _formElementEntry;
//---

window.onload = async function () {
    // Элементы формы + форма ---
    prepareInputTextElementLogin();
    prepareInputPasswordElement();
    prepareCheckboxElementShowPassword();

    await prepareFormElementEntry();
    //---

    if (_formElementEntry) {
        _formElementEntry.changeDisabledStatusToFormElements(false);
    }
}

function prepareInputTextElementLogin() {
    let inputText = document.getElementById("input_text_login");
    if (inputText) {
        _inputTextElementLogin = new InputTextElement(inputText);
    }
}

function prepareInputPasswordElement() {
    let inputPassword = document.getElementById("input_password");
    if (inputPassword) {
        _inputPasswordElement = new InputPasswordElement(inputPassword);
    }
}

function prepareCheckboxElementShowPassword() {
    let divContainer = document.getElementById("div_input_checkbox_show_password");
    let inputCheckbox = document.getElementById("input_checkbox_show_password");
    let label = document.getElementById("label_input_checkbox_show_password");
    if (divContainer && inputCheckbox && label) {
        let inputCheckboxElement = new InputCheckboxElement(divContainer, inputCheckbox, label);
        _inputCheckboxElementShowPassword = new InputCheckboxElementShowPassword(inputCheckboxElement,
            [_inputPasswordElement]);
        _inputCheckboxElementShowPassword.prepare();
    }
}

async function prepareFormElementEntry() {
    let form = document.getElementById("form_entry");
    let buttonSubmit = document.getElementById("button_submit_entry");
    let divMessageContainer = document.getElementById("div_message_container_entry");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementEntry = new FormElementEntry(form, buttonSubmit, divMessageContainer);
        _formElementEntry.setInputTextElementLogin(_inputTextElementLogin);
        _formElementEntry.setInputPasswordElement(_inputPasswordElement);
        _formElementEntry.setInputCheckboxElementShowPassword(_inputCheckboxElementShowPassword);

        await _formElementEntry.prepare();
    }
}