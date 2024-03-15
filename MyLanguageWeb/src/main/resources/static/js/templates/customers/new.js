import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    CustomerUtils
} from "../../classes/utils/entity/customer_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CustomersAPI
} from "../../classes/api/customers_api.js";

import {
    CustomerRequestDTO
} from "../../classes/dto/entity/customer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    RuleElement
} from "../../classes/rule/rule_element.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    RuleTypes
} from "../../classes/rule/rule_types.js";

import {
    ComboBoxWithFlag
} from "../../classes/element_with_flag/combo_box_with_flag.js";

import {
    CountryUtils
} from "../../classes/utils/entity/country_utils.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

const _CUSTOMERS_API = new CustomersAPI();

const _CUSTOMER_UTILS = new CustomerUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _COUNTRY_UTILS = new CountryUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

const _TB_LOGIN_ID = "tb_login";
const _TB_EMAIL_ID = "tb_email";
const _TB_NICKNAME_ID = "tb_nickname";
const _PB_PASSWORD_ID = "pb_password";
const _PB_PASSWORD_REPEAT_ID = "pb_password_repeat";
const _CHECK_SHOW_PASSWORD_ID = "check_show_password";
const _A_CHECK_SHOW_PASSWORD_ID = "a_check_show_password";

const _DIV_COUNTRY_CONTAINER_ID = "div_country_container";
const _CB_COUNTRIES_ID = "cb_countries";
const _DIV_COUNTRY_FLAG_ID = "country_id";

const _FORM_REGISTER_ID = "form_register";
const _BTN_REGISTER_ID = "btn_register";
const _DIV_REGISTRATION_INFO_CONTAINER_ID = "registration_info_container";

let _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function () {
    changeReadonlyStatusInImportantElements(true);

    await prepareCbCountries();
    prepareTbNickname();
    prepareTbEmail();
    prepareTbLogin();
    preparePbPassword();
    preparePbPasswordRepeat();
    prepareShowPasswordContainer();
    prepareSubmit();

    changeReadonlyStatusInImportantElements(false);
};

window.onbeforeunload = async function () {

}

function prepareTbNickname() {
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    tbNickname.addEventListener("input", async function () {
        clearRegistrationInfoContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_NICKNAME.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

async function prepareCbCountries() {
    let divCountryContainer = document.getElementById(_DIV_COUNTRY_CONTAINER_ID);
    let cbCountries = document.getElementById(_CB_COUNTRIES_ID);
    let divCountryFlag = document.getElementById(_DIV_COUNTRY_FLAG_ID);
    if (divCountryContainer && cbCountries && divCountryFlag) {
        let cbCountryWithFlag = new ComboBoxWithFlag(
            divCountryContainer, cbCountries, divCountryFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Выберите страну";

        await _COUNTRY_UTILS.CB_COUNTRIES.prepare(cbCountryWithFlag, firstOption, true);

        cbCountries.addEventListener("change", function () {
            clearRegistrationInfoContainer();
        });
    }
}

function prepareTbEmail() {
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    tbEmail.addEventListener("input", async function () {
        clearRegistrationInfoContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_EMAIL.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

function prepareTbLogin() {
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    tbLogin.addEventListener("input", async function () {
        clearRegistrationInfoContainer();
        await _CUSTOMER_UTILS.TB_CUSTOMER_LOGIN.checkCorrectValue(this, this.parentElement, _CUSTOM_TIMER_CHECKER);
    })
}

function preparePbPassword() {
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    pbPassword.addEventListener("input", function () {
        clearRegistrationInfoContainer();
        _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD.checkCorrectValue(this, this.parentElement);
    })
}

function preparePbPasswordRepeat() {
    let pbPasswordRepeat = document.getElementById(_PB_PASSWORD_REPEAT_ID);
    pbPasswordRepeat.addEventListener("input", function () {
        clearRegistrationInfoContainer();

        let pbPassword = document.getElementById(_PB_PASSWORD_ID);
        if (pbPassword) {
            _CUSTOMER_UTILS.PB_CUSTOMER_PASSWORD_REPEAT.checkCorrectValue(this, pbPassword, this.parentElement);
        }
    })
}

function prepareShowPasswordContainer() {
    let checkShowPassword = document.getElementById(_CHECK_SHOW_PASSWORD_ID);
    checkShowPassword.addEventListener("click", function () {
        clearRegistrationInfoContainer();
        showPassword();
    })

    let aCheckShowPassword = document.getElementById(_A_CHECK_SHOW_PASSWORD_ID);
    aCheckShowPassword.addEventListener("click", function () {
        clearRegistrationInfoContainer();

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

        clearRegistrationInfoContainer();
        let divRegistrationInfoContainer = document.getElementById(_DIV_REGISTRATION_INFO_CONTAINER_ID);
        if (divRegistrationInfoContainer) {
            divRegistrationInfoContainer.appendChild(new LoadingElement().createDiv());
        }
        //---

        if (await checkCorrectBeforeRegister() === true) {
            if (await register() === true) {
                window.onbeforeunload = null;
                formRegister.submit();
            } else {
                changeReadonlyStatusInImportantElements(false);
            }
        } else {
            clearRegistrationInfoContainer();
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

    // Проверяем страну ---
    let isCountryCorrect = false;

    let divCountryContainer = document.getElementById(_DIV_COUNTRY_CONTAINER_ID);
    let cbCountries = document.getElementById(_CB_COUNTRIES_ID);
    let divCountryFlag = document.getElementById(_DIV_COUNTRY_FLAG_ID);
    if (divCountryContainer && cbCountries && divCountryFlag) {
        let cbCountryWithFlag = new ComboBoxWithFlag(
            divCountryContainer, cbCountries, divCountryFlag);

        isCountryCorrect = await _COUNTRY_UTILS.CB_COUNTRIES.checkCorrectValue(cbCountryWithFlag);
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
        && isCountryCorrect === true
        && isEmailCorrect === true
        && isNicknameCorrect === true
        && isPasswordCorrect === true
        && isPasswordRepeatCorrect === true);
}

async function register() {
    let dto = new CustomerRequestDTO();

    // Получаем никнейм ---
    let tbNickname = document.getElementById(_TB_NICKNAME_ID);
    if (tbNickname) {
        dto.nickname = tbNickname.value.trim();
    }
    //---

    // Получаем код страны ---
    let cbCountries = document.getElementById(_CB_COUNTRIES_ID);
    if (cbCountries) {
        dto.countryCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCountries);
    }
    //---

    // Получаем email ---
    let tbEmail = document.getElementById(_TB_EMAIL_ID);
    if (tbEmail) {
        dto.email = tbEmail.value.trim();
    }
    //---

    // Получаем логин ---
    let tbLogin = document.getElementById(_TB_LOGIN_ID);
    if (tbLogin) {
        dto.login = tbLogin.value.trim();
    }
    //---

    // Получаем пароль ---
    let pbPassword = document.getElementById(_PB_PASSWORD_ID);
    if (pbPassword) {
        dto.password = pbPassword.value;
    }
    //---

    let isCorrect = true;

    let divRegistrationInfoContainer = document.getElementById(_DIV_REGISTRATION_INFO_CONTAINER_ID);
    if (divRegistrationInfoContainer) {
        let ruleElement = new RuleElement(divRegistrationInfoContainer, divRegistrationInfoContainer);

        let JSONResponse = await _CUSTOMERS_API.POST.register(dto);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            ruleElement.message = new CustomResponseMessage(JSONResponse.json);
            ruleElement.ruleType = _RULE_TYPES.ERROR;
        }

        if (isCorrect === false) {
            ruleElement.showRule();
        } else {
            ruleElement.removeRule();
        }
    } else {
        isCorrect = false;
    }

    return isCorrect;
}

function clearRegistrationInfoContainer() {
    let registrationInfoContainer = document.getElementById(_DIV_REGISTRATION_INFO_CONTAINER_ID);
    if (registrationInfoContainer) {
        registrationInfoContainer.replaceChildren();
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

    let cbCountries = document.getElementById(_CB_COUNTRIES_ID);
    if (cbCountries) {
        cbCountries.readOnly = isReadonly;
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