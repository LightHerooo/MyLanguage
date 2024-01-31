import {
    CustomTimer
} from "../../classes/custom_timer.js";

import {
    CustomerUtils
} from "../../classes/utils/entity/customer_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

let _CUSTOMER_UTILS = new CustomerUtils();

const _TB_LOGIN_ID = "tb_login";
const _TB_EMAIL_ID = "tb_email";
const _TB_NICKNAME_ID = "tb_nickname";
const _PB_PASSWORD_ID = "pb_password";
const _PB_PASSWORD_REPEAT_ID = "pb_password_repeat";
const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_REGISTER_ID = "form_register";
const _BTN_REGISTER_ID = "btn_register";
const _DIV_ERRORS_CONTAINER_ID = "errors_container";

let _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = function () {
    prepareTbNickname();
    prepareTbEmail();
    prepareTbLogin();
    preparePbPassword();
    preparePbPasswordRepeat();
    prepareShowPasswordContainer();
    prepareSubmit();
};

function prepareTbNickname() {
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    tbNickname.addEventListener("input", async function () {
        await checkCorrectNickname();
    })
}

function prepareTbEmail() {
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    tbEmail.addEventListener("input", async function () {
        await checkCorrectEmail();
    })
}

function prepareTbLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", async function () {
        await checkCorrectLogin();
    })
}

function preparePbPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    pbPassword.addEventListener("input", function () {
        checkCorrectPassword();
    })
}

function preparePbPasswordRepeat() {
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    pbPasswordRepeat.addEventListener("input", function () {
        checkCorrectPasswordRepeat();
    })
}

function prepareShowPasswordContainer() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        showPassword();
    })

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
        checkShowPassword.checked = !checkShowPassword.checked;
        showPassword();
    })
}

function prepareSubmit() {
    let submitRegister = document.getElementById(_FORM_REGISTER_ID);
    let btnRegister = document.getElementById(_BTN_REGISTER_ID);
    submitRegister.addEventListener("submit", async function(event) {
        btnRegister.disabled = true;
        event.preventDefault();

        // Показываем анимацию загрузки (предварительно удалив предыдущие ошибки) ---
        let divErrorsContainer = document.getElementById(_DIV_ERRORS_CONTAINER_ID);
        if (divErrorsContainer) {
            divErrorsContainer.replaceChildren();
        }

        let divLoading = new LoadingElement().createDiv();
        let form = document.getElementById(_FORM_REGISTER_ID);
        form.appendChild(divLoading);
        //---

        if (await checkCorrectBeforeRegister() === true) {
            submitRegister.submit();
        } else {
            form.removeChild(divLoading);
        }

        btnRegister.disabled = false;
    });
}

// Проверяем корректность логина
async function checkCorrectLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    return await _CUSTOMER_UTILS.checkCorrectValueInTbLogin(tbLogin, tbLogin.parentElement, _CUSTOM_TIMER_CHECKER);
}

// Проверяем корректность электронной почты
async function checkCorrectEmail() {
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    return await _CUSTOMER_UTILS.checkCorrectValueInTbEmail(tbEmail, tbEmail.parentElement, _CUSTOM_TIMER_CHECKER);
}

// Проверяем корректность никнейма
async function checkCorrectNickname() {
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    return await _CUSTOMER_UTILS
        .checkCorrectValueInTbNickname(tbNickname, tbNickname.parentElement, _CUSTOM_TIMER_CHECKER);
}

// Проверяем корректность пароля
function checkCorrectPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    return _CUSTOMER_UTILS.checkCorrectValueInPbPassword(pbPassword, pbPassword.parentElement);
}

// Проверяем корректность повтора пароля
function checkCorrectPasswordRepeat() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);

    return _CUSTOMER_UTILS
        .checkCorrectValueInPbPasswordRepeat(pbPasswordRepeat, pbPassword, pbPasswordRepeat.parentElement)
}

function showPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);

    if (checkShowPassword.checked) {
        pbPassword.type = "text";
        pbPasswordRepeat.type = "text";
    } else {
        pbPassword.type = "password";
        pbPasswordRepeat.type = "password";
    }
}

async function checkCorrectBeforeRegister() {
    let isLoginCorrect = await checkCorrectLogin();
    let isEmailCorrect = await checkCorrectEmail();
    let isNicknameCorrect = await checkCorrectNickname();
    let isPasswordCorrect = checkCorrectPassword();
    let isPasswordRepeatCorrect = checkCorrectPasswordRepeat();

    return (isLoginCorrect && isEmailCorrect && isNicknameCorrect && isPasswordCorrect && isPasswordRepeatCorrect);
}