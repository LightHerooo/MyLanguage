import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

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

window.onbeforeunload = async function () {

}

function prepareTbNickname() {
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    tbNickname.addEventListener("input", async function () {
        clearErrorsContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_NICKNAME.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

function prepareTbEmail() {
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    tbEmail.addEventListener("input", async function () {
        clearErrorsContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_EMAIL.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

function prepareTbLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", async function () {
        clearErrorsContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_LOGIN.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

function preparePbPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    pbPassword.addEventListener("input", function () {
        clearErrorsContainer();
        _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD.checkCorrectValue(this, this.parentElement);
    })
}

function preparePbPasswordRepeat() {
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    pbPasswordRepeat.addEventListener("input", function () {
        clearErrorsContainer();

        let pbPassword = document.getElementById(_PB_PASSWORD_ID);
        if (pbPassword) {
            _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD_REPEAT.checkCorrectValue(this, pbPassword, this.parentElement);
        }
    })
}

function prepareShowPasswordContainer() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        clearErrorsContainer();
        showPassword();
    })

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        clearErrorsContainer();

        let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
        checkShowPassword.checked = !checkShowPassword.checked;
        showPassword();
    })
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

function prepareSubmit() {
    let formRegister = document.getElementById(_FORM_REGISTER_ID);
    formRegister.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Блокируем элементы, отображаем загрузку ---
        changeReadonlyStatusInImportantElements(true);

        clearErrorsContainer();
        let divErrorsContainer = document.getElementById(_DIV_ERRORS_CONTAINER_ID);
        if (divErrorsContainer) {
            divErrorsContainer.replaceChildren();
        }

        let divLoading = new LoadingElement().createDiv();
        let form = document.getElementById(_FORM_REGISTER_ID);
        form.appendChild(divLoading);
        //---

        if (await checkCorrectBeforeRegister() === true) {
            window.onbeforeunload = null;
            formRegister.submit();
        } else {
            form.removeChild(divLoading);
            changeReadonlyStatusInImportantElements(false);
        }
    });
}

// Регистрация пользователя ---
async function checkCorrectBeforeRegister() {
    // Проверяем никнейм ---
    let isNicknameCorrect = false;
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    if (tbNickname) {
        isNicknameCorrect = await _CUSTOMER_UTILS.TB_CUSTOMER_NICKNAME.checkCorrectValue(
            tbNickname, tbNickname.parentElement, _CUSTOM_TIMER_CHECKER);
    }
    //---

    // Проверяем Email ---
    let isEmailCorrect = false;
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    if (tbEmail) {
        isEmailCorrect = await _CUSTOMER_UTILS.TB_CUSTOMER_EMAIL.checkCorrectValue(
            tbEmail, tbEmail.parentElement, _CUSTOM_TIMER_CHECKER);
    }
    //---

    // Проверяем логин ---
    let isLoginCorrect = false;
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    if (tbLogin) {
        isLoginCorrect = await _CUSTOMER_UTILS.TB_CUSTOMER_LOGIN.checkCorrectValue(
            tbLogin, tbLogin.parentElement, _CUSTOM_TIMER_CHECKER);
    }
    //---

    // Проверяем пароль ---
    let isPasswordCorrect = false;
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    if (pbPassword) {
        isPasswordCorrect = _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD.checkCorrectValue(pbPassword, pbPassword.parentElement);
    }
    //---

    // Проверяем повтор пароля ---
    let isPasswordRepeatCorrect = false;
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    if (pbPasswordRepeat && pbPassword) {
        isPasswordRepeatCorrect = _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD_REPEAT.checkCorrectValue(
            pbPasswordRepeat, pbPassword, pbPasswordRepeat.parentElement)
    }
    //---

    return (isLoginCorrect === true
        && isEmailCorrect === true
        && isNicknameCorrect === true
        && isPasswordCorrect === true
        && isPasswordRepeatCorrect === true);
}

function clearErrorsContainer() {
    let divErrorsContainer = document.getElementById(_DIV_ERRORS_CONTAINER_ID);
    if (divErrorsContainer) {
        divErrorsContainer.replaceChildren();
    }
}

function changeReadonlyStatusInImportantElements(isReadonly) {
    let btnRegister = document.getElementById(_BTN_REGISTER_ID);
    if (btnRegister) {
        btnRegister.disabled = isReadonly;
    }

    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    if (tbNickname) {
        tbNickname.readOnly = isReadonly;
    }

    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    if (tbEmail) {
        tbEmail.readOnly = isReadonly;
    }

    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    if (tbLogin) {
        tbLogin.readOnly = isReadonly;
    }

    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    if (pbPassword) {
        pbPassword.readOnly = isReadonly;
    }

    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    if (pbPasswordRepeat) {
        pbPasswordRepeat.readOnly = isReadonly;
    }

    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    if (checkShowPassword) {
        checkShowPassword.readOnly = isReadonly;
    }

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    if (aCheckShowPassword) {
        if (isReadonly === true) {
            aCheckShowPassword.style.pointerEvents = "none";
            aCheckShowPassword.style.cursor = "default";
        } else {
            aCheckShowPassword.style.cssText = "";
        }
    }
}
//---