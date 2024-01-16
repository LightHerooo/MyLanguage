import {
    getJSONResponseFindExistsByEmail,
    getJSONResponseFindExistsByLogin, getJSONResponseFindExistsByNickname
} from "../api/customers.js";

import {
    getOrCreateRule,
    changeRuleStatus,
    setMessageInRule
} from "../utils/div_rules.js";

import {
    Timer
} from "../classes/timer.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

const _HTTP_STATUSES = new HttpStatuses();

const _TB_LOGIN_ID = "tb_login";
const _TB_EMAIL_ID = "tb_email";
const _TB_NICKNAME_ID = "tb_nickname";
const _PB_PASSWORD_ID = "pb_password";
const _PB_PASSWORD_REPEAT_ID = "pb_password_repeat";
const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_REGISTER_ID = "form_register";
const _BTN_REGISTER_ID = "btn_register";

const _T_CHECKER_MILLISECONDS = 250;
let _tChecker = new Timer(null);

window.onload = function () {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", async function () {
        await checkCorrectLogin();
    })

    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    tbEmail.addEventListener("input", async function () {
        await checkCorrectEmail();
    })

    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    tbNickname.addEventListener("input", async function () {
        await checkCorrectNickname();
    })

    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    pbPassword.addEventListener("input", async function () {
        await checkCorrectPassword();
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
    let btnRegister = document.getElementById(_BTN_REGISTER_ID);
    submitRegister.addEventListener("submit", async function(event) {
        btnRegister.disabled = true;
        event.preventDefault();

        if (await checkCorrectBeforeRegister()) {
            submitRegister.submit();
        }
        btnRegister.disabled = false;
    });
};

// Проверка рассматриваемого поля на ошибки
function validateInputFieldByAPI(JSONResponse, divRuleId, divRuleParentId) {
    let isCorrect = true;
    let divRuleElement = getOrCreateRule(divRuleId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        isCorrect = false;
        let json = JSONResponse.json;
        setMessageInRule(divRuleElement, json["text"]);
    }

    changeRuleStatus(divRuleElement, divRuleParentId, isCorrect);

    return isCorrect;
}

// Проверяем корректность логина
async function checkCorrectLogin() {
    const DIV_RULE_PARENT_ID = "div_container_login";
    const DIV_RULE_ID = "div_rule_login";
    const INPUT_ELEMENT_ID = _TB_LOGIN_ID;

    const LOGIN_MIN_SIZE = 3;
    const LOGIN_MAX_SIZE = 15;
    const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value.trim();

    // Чистим таймер, чтобы снова проверить через API
    clearTimeout(_tChecker.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Логин не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (!LOGIN_REGEXP.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Логин должен содержать только английские буквы, цифры и знаки подчеркивания [_].";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (inputText.length < LOGIN_MIN_SIZE || inputText.length > LOGIN_MAX_SIZE) {
        isCorrect = false;
        divRuleElement.textContent = `Логин должен быть от ${LOGIN_MIN_SIZE} до ${LOGIN_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else {
        // Убираем предыдущие возможные ошибки
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, true);

        // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
        let JSONResponsePromise = new Promise(resolve => {
            _tChecker.id = setTimeout(async function () {
                resolve(await getJSONResponseFindExistsByLogin(inputText));
            }, _T_CHECKER_MILLISECONDS);
        });

        let JSONResponse = await JSONResponsePromise;
        isCorrect = validateInputFieldByAPI(JSONResponse, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }

    return isCorrect;
}

// Проверяем корректность электронной почты
async function checkCorrectEmail() {
    const DIV_RULE_PARENT_ID = "div_container_email";
    const DIV_RULE_ID = "div_rule_email";
    const INPUT_ELEMENT_ID = _TB_EMAIL_ID;

    const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value.trim();

    // Чистим таймер, чтобы снова проверить через API
    clearTimeout(_tChecker.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Электронная почта не может быть пустой.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (!EMAIL_REGEXP.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Некорректная электронная почта.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else {
        // Убираем предыдущие возможные ошибки
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, true);

        // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
        let JSONResponsePromise = new Promise(resolve => {
            _tChecker.id = setTimeout(async function () {
                resolve(await getJSONResponseFindExistsByEmail(inputText));
            }, _T_CHECKER_MILLISECONDS);
        });

        let JSONResponse = await JSONResponsePromise;
        isCorrect = validateInputFieldByAPI(JSONResponse, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }

    return isCorrect;
}

// Проверяем корректность никнейма
async function checkCorrectNickname() {
    const DIV_RULE_PARENT_ID = "div_container_nickname";
    const DIV_RULE_ID = "div_rule_nickname";
    const INPUT_ELEMENT_ID = _TB_NICKNAME_ID;

    const NICKNAME_MIN_SIZE = 3;
    const NICKNAME_MAX_SIZE = 15;
    const NICKNAME_REGEXP = /^[^ ]+$/;

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value.trim();

    // Чистим таймер, чтобы снова проверить через API
    clearTimeout(_tChecker.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Никнейм не может быть пустым.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (!NICKNAME_REGEXP.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Никнейм не должен содержать пробелов.";
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else if (inputText.length < NICKNAME_MIN_SIZE || inputText.length > NICKNAME_MAX_SIZE) {
        isCorrect = false;
        divRuleElement.textContent = `Никнейм должен быть от ${NICKNAME_MIN_SIZE} до ${NICKNAME_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    } else {
        // Убираем предыдущие возможные ошибки
        changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, true);

        // Запускаем таймер и обращаемся в API (чтобы избежать спама от пользователей)
        let JSONResponsePromise = new Promise(resolve => {
            _tChecker.id = setTimeout(async function () {
                resolve(await getJSONResponseFindExistsByNickname(inputText));
            }, _T_CHECKER_MILLISECONDS);
        });

        let JSONResponse = await JSONResponsePromise;
        isCorrect = validateInputFieldByAPI(JSONResponse, DIV_RULE_ID, DIV_RULE_PARENT_ID);
    }

    return isCorrect;
}

// Проверяем корректность пароля
function checkCorrectPassword() {
    const DIV_RULE_PARENT_ID = "div_container_password";
    const DIV_RULE_ID = "div_rule_password";
    const INPUT_ELEMENT_ID = _PB_PASSWORD_ID;

    const PASSWORD_MIN_SIZE = 8;
    const PASSWORD_REGEXP_DIGITS = /^.*[0-9]+.*$/;
    const PASSWORD_REGEXP_SPECIAL_SYMBOLS = /^.*[%@?~#-]+.*$/;
    const PASSWORD_SPECIAL_SYMBOLS = "%, @, ?, ~, #, -";

    let isCorrect;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = document.getElementById(INPUT_ELEMENT_ID).value;
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Пароль не может быть пустым.";
    } else if (inputText.length < PASSWORD_MIN_SIZE) {
        isCorrect = false;
        divRuleElement.textContent = `Пароль должен быть не менее ${PASSWORD_MIN_SIZE} символов.`;
    } else if (!PASSWORD_REGEXP_DIGITS.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Пароль должен содержать минимум одну цифру [0-9].";
    } else if (!PASSWORD_REGEXP_SPECIAL_SYMBOLS.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = `Пароль должен содержать минимум один специальный символ ${PASSWORD_SPECIAL_SYMBOLS}.`;
    } else {
        isCorrect = true;
    }

    changeRuleStatus(divRuleElement, DIV_RULE_PARENT_ID, isCorrect);
    isCorrect = checkCorrectPasswordRepeat();

    return isCorrect;
}

// Проверяем корректность повтора пароля
function checkCorrectPasswordRepeat() {
    const DIV_RULE_PARENT_ID = "div_container_password_repeat";
    const DIV_RULE_ID = "div_rule_password_repeat";
    const INPUT_ELEMENT_ID_PASSWORD = _PB_PASSWORD_ID;
    const INPUT_ELEMENT_ID_PASSWORD_REPEAT = _PB_PASSWORD_REPEAT_ID;

    let isCorrect;
    let divRule = getOrCreateRule(DIV_RULE_ID);
    let passwordText = document.getElementById(INPUT_ELEMENT_ID_PASSWORD).value;
    let passwordRepeatText = document.getElementById(INPUT_ELEMENT_ID_PASSWORD_REPEAT).value;
    if (passwordText !== passwordRepeatText) {
        divRule.textContent = "Пароли не совпадают.";
        isCorrect = false;
    } else {
        isCorrect = true;
    }

    changeRuleStatus(divRule, DIV_RULE_PARENT_ID, isCorrect);

    return isCorrect;
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

async function checkCorrectBeforeRegister() {
    let isLoginCorrect = await checkCorrectLogin();
    let isEmailCorrect = await checkCorrectEmail();
    let isNicknameCorrect = await checkCorrectNickname();
    let isPasswordCorrect = checkCorrectPassword();

    return (isLoginCorrect && isEmailCorrect && isNicknameCorrect && isPasswordCorrect);
}