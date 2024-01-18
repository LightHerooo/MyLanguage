import {
    changeRuleStatus,
    getOrCreateRule
} from "../../utils/div_rules.js";

const _TB_LOGIN_ID = "tb_login";
const _PB_PASSWORD_ID = "pb_password";

const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_ENTRY_ID = "form_entry";
const _BTN_ENTRY_ID = "btn_entry";

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
    let btnEntry = document.getElementById(_BTN_ENTRY_ID);
    submitEntry.addEventListener("submit", event => {
        btnEntry.disabled = true;
        event.preventDefault();

        if (checkCorrectBeforeEntry()) {
            submitEntry.submit();
        }
        btnEntry.disabled = false;
    });
}

function checkCorrectLogin() {
    const DIV_RULE_PARENT_ID = "div_container_login";
    const DIV_RULE_ID = "div_rule_login";
    const INPUT_ELEMENT_ID = _TB_LOGIN_ID;

    const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value.trim();
    if (!inputText) {
        isCorrect= false;
        divRuleElement.textContent = "Логин не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (!LOGIN_REGEXP.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Логин должен содержать только английские буквы, цифры и знаки подчеркивания [_].";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    }
    else {
        isCorrect = true;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    }

    return isCorrect;
}

function checkCorrectPassword() {
    const DIV_RULE_PARENT_ID = "div_container_password";
    const DIV_RULE_ID = "div_rule_password";
    const INPUT_ELEMENT_ID = _PB_PASSWORD_ID;

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Пароль не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else {
        isCorrect = true;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    }

    return isCorrect;
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
    let isLoginCorrect = checkCorrectLogin();
    let isPasswordCorrect = checkCorrectPassword();

    return (isLoginCorrect && isPasswordCorrect);
}