import {
    URL_TO_API_CUSTOMERS_EXISTS_BY_LOGIN,
    URL_TO_API_CUSTOMERS_EXISTS_BY_EMAIL,
    URL_TO_API_CUSTOMERS_EXISTS_BY_NICKNAME
} from "../api/customers.js";

import {
    getOrCreateRule,
    changeRuleStatus,
    setMessageInRule
} from "../utils/div_rules.js";

import {
    InputField
} from "../classes/inputField.js"

const _TB_LOGIN_ID = "tb_login";
const _TB_EMAIL_ID = "tb_email";
const _TB_NICKNAME_ID = "tb_nickname";
const _PB_PASSWORD_ID = "pb_password";
const _PB_PASSWORD_REPEAT_ID = "pb_password_repeat";
const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_REGISTER_ID = "form_register";

// RESPONSE_MESSAGE_ID

let _inFLogin = new InputField(false);
let _inFEmail = new InputField(false);
let _inFNickname = new InputField(false);
let _inFPassword = new InputField(false);
let _inFPasswordRepeat = new InputField(false);

window.onload = function () {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", function () {
        checkCorrectLogin();
    })

    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    tbEmail.addEventListener("input", function () {
        checkCorrectEmail();
    })

    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    tbNickname.addEventListener("input", function () {
        checkCorrectNickname();
    })

    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    pbPassword.addEventListener("input", function () {
        checkCorrectPassword();
    })

    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    pbPasswordRepeat.addEventListener("input", function () {
        checkCorrectPasswordRepeat();
    })

    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        showPassword();
    })

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        showPasswordByLink();
    })

    let submitRegister = document.getElementById(_FORM_REGISTER_ID);
    submitRegister.addEventListener("submit", event => {
        if (!checkCorrectBeforeRegister()) {
            event.preventDefault();
        }
    })
};

// Проверка рассматриваемого поля на ошибки
function validateInputFieldByAPI(requestURL, inputFieldObject, spanRuleId, divRuleParentId) {
    const XML_REQUEST_TYPE = "GET";
    const XML_RESPONSE_TYPE = "json";
    const XML_STATUS_BAD = 400;

    let xml = new XMLHttpRequest();
    xml.open(XML_REQUEST_TYPE, requestURL);
    xml.responseType = XML_RESPONSE_TYPE;
    xml.onload = () => {
        let responseJSON = xml.response;

        let divRuleElement = getOrCreateRule(spanRuleId);
        if (xml.status === XML_STATUS_BAD) {
            inputFieldObject.isCorrect = true;
        } else {
            inputFieldObject.isCorrect = false;
            setMessageInRule(divRuleElement, responseJSON["text"]);
        }
        changeRuleStatus(divRuleElement, divRuleParentId, inputFieldObject.isCorrect);
    }
    xml.send();
}

// Проверяем корректность логина
function checkCorrectLogin() {
    const DIV_RULE_PARENT_ID = "div_container_login";
    const DIV_RULE_ID = "div_rule_login";
    const INPUT_ELEMENT_ID = _TB_LOGIN_ID;
    const INPUT_FIELD_OBJECT = _inFLogin;

    const LOGIN_MIN_SIZE = 3;
    const LOGIN_MAX_SIZE = 15;
    const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;

    const URL_TO_API = URL_TO_API_CUSTOMERS_EXISTS_BY_LOGIN;
    const URL_PARAMETER_ID_LOGIN = "login";

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
    } else if (inputText.length < LOGIN_MIN_SIZE || inputText.length > LOGIN_MAX_SIZE) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = `Логин должен быть от ${LOGIN_MIN_SIZE} до ${LOGIN_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else {
        let requestURL = new URL(URL_TO_API);
        requestURL.searchParams.set(URL_PARAMETER_ID_LOGIN, inputText);
        validateInputFieldByAPI(requestURL, INPUT_FIELD_OBJECT, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }
}

// Проверяем корректность электронной почты
function checkCorrectEmail() {
    const DIV_RULE_PARENT_ID = "div_container_email";
    const DIV_RULE_ID = "div_rule_email";
    const INPUT_ELEMENT_ID = _TB_EMAIL_ID;
    const INPUT_FIELD_OBJECT = _inFEmail;

    const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const URL_TO_API = URL_TO_API_CUSTOMERS_EXISTS_BY_EMAIL;
    const URL_PARAMETER_ID_EMAIL = "email";

    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Электронная почта не может быть пустой.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else if (!EMAIL_REGEXP.test(inputText)) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Некорректная электронная почта.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else {
        let requestURL = new URL(URL_TO_API);
        requestURL.searchParams.set(URL_PARAMETER_ID_EMAIL, inputText);
        validateInputFieldByAPI(requestURL, INPUT_FIELD_OBJECT, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }
}

// Проверяем корректность никнейма
function checkCorrectNickname() {
    const DIV_RULE_PARENT_ID = "div_container_nickname";
    const DIV_RULE_ID = "div_rule_nickname";
    const INPUT_ELEMENT_ID = _TB_NICKNAME_ID;
    const INPUT_FIELD_OBJECT = _inFNickname;

    const NICKNAME_MIN_SIZE = 3;
    const NICKNAME_MAX_SIZE = 15;
    const NICKNAME_REGEXP = /^[^ ]+$/;

    const URL_TO_API = URL_TO_API_CUSTOMERS_EXISTS_BY_NICKNAME;
    const URL_PARAMETER_ID_NICKNAME = "nickname";

    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Никнейм не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else if (!NICKNAME_REGEXP.test(inputText)) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Никнейм не должен содержать пробелов.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else if (inputText.length < NICKNAME_MIN_SIZE || inputText.length > NICKNAME_MAX_SIZE) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = `Никнейм должен быть от ${NICKNAME_MIN_SIZE} до ${NICKNAME_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    } else {
        let requestURL = new URL(URL_TO_API);
        requestURL.searchParams.set(URL_PARAMETER_ID_NICKNAME, inputText);
        validateInputFieldByAPI(requestURL, INPUT_FIELD_OBJECT, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }
}

// Проверяем корректность пароля
function checkCorrectPassword() {
    const DIV_RULE_PARENT_ID = "div_container_password";
    const DIV_RULE_ID = "div_rule_password";
    const INPUT_ELEMENT_ID = _PB_PASSWORD_ID;
    const INPUT_FIELD_OBJECT = _inFPassword;

    const PASSWORD_MIN_SIZE = 8;
    const PASSWORD_REGEXP_DIGITS = /^.*[0-9]+.*$/;
    const PASSWORD_REGEXP_SPECIAL_SYMBOLS = /^.*[%@?~#-]+.*$/;
    const PASSWORD_SPECIAL_SYMBOLS = "%, @, ?, ~, #, -";

    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Пароль не может быть пустым.";
    } else if (inputText.length < PASSWORD_MIN_SIZE) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = `Пароль должен быть не менее ${PASSWORD_MIN_SIZE} символов.`;
    } else if (!PASSWORD_REGEXP_DIGITS.test(inputText)) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = "Пароль должен содержать минимум одну цифру [0-9].";
    } else if (!PASSWORD_REGEXP_SPECIAL_SYMBOLS.test(inputText)) {
        INPUT_FIELD_OBJECT.isCorrect = false;
        divRuleElement.textContent = `Пароль должен содержать минимум один специальный символ ${PASSWORD_SPECIAL_SYMBOLS}.`;
    } else {
        INPUT_FIELD_OBJECT.isCorrect = true;
    }

    changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
    checkCorrectPasswordRepeat();
}

// Проверяем корректность повтора пароля
function checkCorrectPasswordRepeat() {
    const DIV_RULE_PARENT_ID = "div_container_password_repeat";
    const DIV_RULE_ID = "div_rule_password_repeat";
    const INPUT_ELEMENT_ID_PASSWORD = _PB_PASSWORD_ID;
    const INPUT_ELEMENT_ID_PASSWORD_REPEAT = _PB_PASSWORD_REPEAT_ID;
    const INPUT_FIELD_OBJECT = _inFPasswordRepeat;

    let divRule = getOrCreateRule(DIV_RULE_ID);
    let passwordText = document.getElementById(INPUT_ELEMENT_ID_PASSWORD).value;
    let passwordRepeatText = document.getElementById(INPUT_ELEMENT_ID_PASSWORD_REPEAT).value;
    if (passwordText !== passwordRepeatText) {
        divRule.textContent = "Пароли не совпадают.";
        INPUT_FIELD_OBJECT.isCorrect = false;
    } else {
        INPUT_FIELD_OBJECT.isCorrect = true;
    }

    changeRuleStatus(divRule, DIV_RULE_PARENT_ID, INPUT_FIELD_OBJECT.isCorrect);
}

function showPassword() {
    const INPUT_ELEMENT_ID_PASSWORD = _PB_PASSWORD_ID;
    const INPUT_ELEMENT_ID_PASSWORD_REPEAT = _PB_PASSWORD_REPEAT_ID;
    const ELEMENT_ID_CHECK_SHOW_PASSWORD = _CHECK_SHOW_PASSWORD_ID;

    let pbPassword = document.getElementById(INPUT_ELEMENT_ID_PASSWORD);
    let pbPasswordRepeat = document.getElementById(INPUT_ELEMENT_ID_PASSWORD_REPEAT);
    let checkShowPassword = document.getElementById(ELEMENT_ID_CHECK_SHOW_PASSWORD);

    if (checkShowPassword.checked) {
        pbPassword.type = "text";
        pbPasswordRepeat.type = "text";
    } else {
        pbPassword.type = "password";
        pbPasswordRepeat.type = "password";
    }
}

function showPasswordByLink() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.checked = !checkShowPassword.checked;
    showPassword();
}

function checkCorrectBeforeRegister() {
    checkCorrectLogin();
    checkCorrectEmail();
    checkCorrectNickname();
    checkCorrectPassword();

    return (_inFLogin.isCorrect && _inFEmail.isCorrect && _inFNickname.isCorrect
        && _inFPassword.isCorrect && _inFPasswordRepeat.isCorrect);
}