import {
    RuleElement
} from "../../classes/rule/rule_element.js";

import {
    RuleTypes
} from "../../classes/rule/rule_types.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

const _RULE_TYPES = new RuleTypes();

const _TB_LOGIN_ID = "tb_login";
const _PB_PASSWORD_ID = "pb_password";

const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";
const _FORM_ENTRY_ID = "form_entry";
const _BTN_ENTRY_ID = "btn_entry";
const _DIV_ENTRY_INFO_CONTAINER_ID = "entry_info_container";

window.onload = function () {
    prepareTbLogin();
    preparePbPassword();
    prepareShowPasswordContainer();
    prepareSubmit();
}

function prepareTbLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", function () {
        clearEntryInfoContainer();
        checkCorrectLogin();
    });
}

function preparePbPassword() {
    let tbPassword = document.getElementById(_PB_PASSWORD_ID);
    tbPassword.addEventListener("input", function () {
        clearEntryInfoContainer();
        checkCorrectPassword();
    });
}

function prepareShowPasswordContainer() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        clearEntryInfoContainer();
        showPassword();
    });

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        clearEntryInfoContainer();

        let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
        checkShowPassword.checked = !checkShowPassword.checked;
        showPassword();
    });
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

function prepareSubmit() {
    let formEntry = document.getElementById(_FORM_ENTRY_ID);
    formEntry.addEventListener("submit", event => {
        event.preventDefault();

        // Блокируем элементы, отображаем загрузку ---
        changeReadonlyStatusInImportantElements(true);

        clearEntryInfoContainer();
        let divLoading = new LoadingElement().createDiv();
        let form = document.getElementById(_FORM_ENTRY_ID);
        if (form) {
            form.appendChild(divLoading);
        }
        //---

        if (checkCorrectBeforeEntry() === true) {
            formEntry.submit();
        } else {
            form.removeChild(divLoading);
            changeReadonlyStatusInImportantElements(false);
        }
    });
}

// Вход пользователя ---
function checkCorrectLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);

    let isCorrect = true;
    let ruleElement = new RuleElement(tbLogin, tbLogin.parentElement);

    let inputText = tbLogin.value.trim();
    if (!inputText) {
        isCorrect = false;
        ruleElement.message = "Логин не может быть пустым.";
        ruleElement.ruleType = _RULE_TYPES.ERROR;
    }

    // Отображаем предупреждение (правило), если это необходимо ---
    if (isCorrect === false) {
        ruleElement.showRule();
    } else {
        ruleElement.removeRule();
    }
    //---

    return isCorrect;
}

function checkCorrectPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);

    let isCorrect = true;
    let ruleElement = new RuleElement(pbPassword, pbPassword.parentElement);

    let inputText = pbPassword.value;
    if (!inputText) {
        isCorrect = false;
        ruleElement.message = "Пароль не может быть пустым.";
        ruleElement.ruleType = _RULE_TYPES.ERROR;
    }

    // Отображаем предупреждение (правило), если это необходимо ---
    if (isCorrect === false) {
        ruleElement.showRule();
    } else {
        ruleElement.removeRule();
    }
    //---

    return isCorrect;
}

function checkCorrectBeforeEntry() {
    let isLoginCorrect = checkCorrectLogin();
    let isPasswordCorrect = checkCorrectPassword();

    return (isLoginCorrect === true
        && isPasswordCorrect === true);
}

function clearEntryInfoContainer() {
    let divEntryInfoContainer = document.getElementById(_DIV_ENTRY_INFO_CONTAINER_ID);
    if (divEntryInfoContainer) {
        divEntryInfoContainer.replaceChildren();
    }
}

function changeReadonlyStatusInImportantElements(isReadonly) {
    let btnEntry = document.getElementById(_BTN_ENTRY_ID);
    if (btnEntry) {
        btnEntry.disabled = isReadonly;
    }

    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    if (tbLogin) {
        tbLogin.readOnly = isReadonly;
    }

    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    if (pbPassword) {
        pbPassword.readOnly = isReadonly;
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