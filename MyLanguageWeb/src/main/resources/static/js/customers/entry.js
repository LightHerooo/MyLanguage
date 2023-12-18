import {
    InputField
} from "../classes/inputField.js"
import {
    changeRuleStatus,
    getOrCreateRule
} from "../utils/div_rules.js";

const _TB_LOGIN_ID = "tb_login";
const _PB_PASSWORD_ID = "pb_password";

const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_ENTRY_ID = "form_entry";

let _inFLogin = new InputField(false);
let _inFPassword = new InputField(false);

window.onload = function () {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", function () {
        checkCorrectLogin();
    });

    let tbPassword = document.getElementById(_PB_PASSWORD_ID);
    tbPassword.addEventListener("input", function () {
        checkCorrectPassword();
    });

    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        showPassword();
    });

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        showPasswordByLink();
    });

    let submitEntry = document.getElementById(_FORM_ENTRY_ID);
    submitEntry.addEventListener("submit", event => {
        if (!checkCorrectBeforeEntry()) {
            event.preventDefault();
        }
    });
}

function checkCorrectLogin() {
    const DIV_RULE_PARENT_ID = "div_container_login";
    const DIV_RULE_ID = "div_rule_login";
    const INPUT_ELEMENT_ID = _TB_LOGIN_ID;
    const INPUT_FIELD_OBJECT = _inFLogin;

    const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;

    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Логин не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else if (!LOGIN_REGEXP.test(inputText)) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Логин должен содержать только английские буквы, цифры и знаки подчеркивания [_].";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    }
    else {
        INPUT_FIELD_OBJECT.isCorrect = true;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    }
}

function checkCorrectPassword() {
    const DIV_RULE_PARENT_ID = "div_container_password";
    const DIV_RULE_ID = "div_rule_password";
    const INPUT_ELEMENT_ID = _PB_PASSWORD_ID;
    const INPUT_FIELD_OBJECT = _inFPassword;

    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Пароль не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else {
        INPUT_FIELD_OBJECT.isCorrect = true;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    }
}

function showPassword() {
    const INPUT_ELEMENT_ID_PASSWORD = _PB_PASSWORD_ID;
    const ELEMENT_ID_CHECK_SHOW_PASSWORD = _CHECK_SHOW_PASSWORD_ID;

    let pbPassword = document.getElementById(INPUT_ELEMENT_ID_PASSWORD);
    let checkShowPassword = document.getElementById(ELEMENT_ID_CHECK_SHOW_PASSWORD);

    if (checkShowPassword.checked) {
        pbPassword.type = "text";
    } else {
        pbPassword.type = "password";
    }
}

function showPasswordByLink() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.checked = !checkShowPassword.checked;
    showPassword();
}

function checkCorrectBeforeEntry() {
    checkCorrectLogin();
    checkCorrectPassword();

    return (_inFLogin.isCorrect && _inFPassword.isCorrect);
}