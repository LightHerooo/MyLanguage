import {
    CustomersAPI
} from "../../classes/api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../classes/api/classes/http/http_statuses.js";

import {
    SelectWithRuleElementCountries
} from "../../classes/html/select/entity/country/select_with_rule_element_countries.js";

import {
    InputTextWithRuleElementCustomerNickname
} from "../../classes/html/input/text/entity/customer/input_text_with_rule_element_customer_nickname.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputImgElementCustomerAvatar
} from "../../classes/html/input/file/entity/input_img_element_customer_avatar.js";

import {
    FormElementCustomerEditProfile
} from "../../classes/html/form/entity/customer/edit/form_element_customer_edit_profile.js";

import {
    TextareaElement
} from "../../classes/html/textarea/textarea_element.js";

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
    InputCheckboxElementShowPassword
} from "../../classes/html/input/checkbox/elements/input_checkbox_element_show_password.js";

import {
    InputCheckboxElement
} from "../../classes/html/input/checkbox/input_checkbox_element.js";

import {
    FormElementCustomerEditPassword
} from "../../classes/html/form/entity/customer/edit/form_element_customer_edit_password.js";

import {
    CustomerResponseDTO
} from "../../classes/dto/entity/customer/response/customer_response_dto.js";

import {
    TextareaWithCounterElement
} from "../../classes/html/textarea/with_counter/textarea_with_counter_element.js";

import {
    TextareaWithRuleElementCustomerDescription
} from "../../classes/html/textarea/entity/customer/textarea_element_customer_description.js";

import {
    ProjectCookies
} from "../../classes/html/project_cookies.js";

import {
    InputTextWithRuleElement
} from "../../classes/html/input/text/input_text_with_rule_element.js";

import {
    InputPasswordWithRuleElement
} from "../../classes/html/input/password/input_password_with_rule_element.js";

import {
    TextareaWithCounterAndRuleElement
} from "../../classes/html/textarea/with_counter/textarea_with_counter_and_rule_element.js";

const _CUSTOMERS_API = new CustomersAPI();

const _PROJECT_COOKIES = new ProjectCookies();
const _HTTP_STATUSES = new HttpStatuses();

// Элементы формы + форма "Изменение профиля пользователя" ---
let _inputImgElementCustomerAvatar;
let _inputTextWithRuleElementCustomerNickname;
let _selectWithRuleElementCountries;
let _textareaWithRuleElementCustomerDescription;

let _formElementCustomerEditProfile;
//---

// Элементы формы + форма "Изменение пароля пользователя" ---
let _inputPasswordWithRuleElementOld;
let _inputPasswordWithRuleElementCustomerPassword;
let _inputPasswordWithRuleElementRepeat;
let _inputCheckboxElementShowPassword;

let _formElementCustomerEditPassword;
//---

let _currentCustomer;

window.onload = async function() {
    // Пытаемся найти авторизированного пользователя ---
    await tryToFindCurrentCustomer();
    //---

    // Элементы формы + форма "Изменение профиля пользователя" ---
    prepareInputImgElementCustomerAvatar();
    prepareInputTextElementCustomerNickname();
    await prepareSelectWithRuleElementCountries();
    prepareTextareaWithRuleElementCustomerDescription();

    await prepareFormElementCustomerEditProfile();
    //---

    // Элементы формы + форма "Изменение пароля пользователя" ---
    prepareInputPasswordWithRuleElementOld();
    prepareInputPasswordWithRuleElementCustomer();
    prepareInputPasswordWithRuleElementRepeat();
    prepareInputCheckboxElementShowPassword();

    await prepareFormElementCustomerEditPassword();
    //---

    if (_formElementCustomerEditProfile) {
        _formElementCustomerEditProfile.changeDisabledStatusToFormElements(false);
    }

    if (_formElementCustomerEditPassword) {
        _formElementCustomerEditPassword.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

async function tryToFindCurrentCustomer() {
    // Ищем авторизированного пользователя ---
    let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();

    let jsonResponse = await _CUSTOMERS_API.GET.findById(customerId);
    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
        _currentCustomer = new CustomerResponseDTO(jsonResponse.getJson());
    }
    //---
}

// Элементы формы + форма "Изменение профиля пользователя" ---
function prepareInputImgElementCustomerAvatar() {
    let divInputImgContainer = document.getElementById("div_input_img_customer_avatar");
    let img = document.getElementById("img_customer_avatar");
    let divInputFileContainer = document.getElementById("div_input_file_customer_avatar");
    let labelContainer = document.getElementById("label_input_file_customer_avatar");
    let inputFile = document.getElementById("input_file_customer_avatar");
    let buttonDropSelectedFiles = document.getElementById("button_drop_selected_files_customer_avatar");
    let divMessageContainer = document.getElementById("div_input_file_message_container_customer_avatar");
    if (divInputImgContainer && img && divInputFileContainer && labelContainer && inputFile
            && buttonDropSelectedFiles && divMessageContainer) {
        _inputImgElementCustomerAvatar = new InputImgElementCustomerAvatar(divInputImgContainer, img, divInputFileContainer,
            labelContainer, inputFile, buttonDropSelectedFiles, divMessageContainer);
        _inputImgElementCustomerAvatar.setCustomerResponseDTO(_currentCustomer);
        _inputImgElementCustomerAvatar.prepare();
    }
}

function prepareInputTextElementCustomerNickname() {
    let inputText = document.getElementById("input_text_customer_nickname");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementCustomerNickname = new InputTextWithRuleElementCustomerNickname(inputTextWithRuleElement);
        _inputTextWithRuleElementCustomerNickname.prepare();

        if (_currentCustomer) {
            _inputTextWithRuleElementCustomerNickname.setCustomerId(_currentCustomer.getId());
            inputText.value = _currentCustomer.getNickname();
        }
    }
}

async function prepareSelectWithRuleElementCountries() {
    let divContainer = document.getElementById("div_select_countries");
    let select = document.getElementById("select_countries");
    let spanFlag = document.getElementById("span_flag_select_countries");
    if (divContainer && select && spanFlag) {
        _selectWithRuleElementCountries = new SelectWithRuleElementCountries(
            divContainer, select, spanFlag, true, true);
        _selectWithRuleElementCountries.prepare();
        await _selectWithRuleElementCountries.fill();

        if (_currentCustomer) {
            let country = _currentCustomer.getCountry();
            if (country) {
                _selectWithRuleElementCountries.changeSelectedOptionByValue(
                    country.getCode(), true);
            }
        }
    }
}

function prepareTextareaWithRuleElementCustomerDescription() {
    let divContainer = document.getElementById("div_textarea_customer_description");
    let textarea = document.getElementById("textarea_customer_description");
    let spanCounter = document.getElementById("span_counter_textarea_customer_description");
    if (divContainer && textarea && spanCounter) {
        let textareaElement = new TextareaElement(textarea);
        let textareaWithCounterElement = new TextareaWithCounterElement(
            divContainer, textareaElement, spanCounter);
        let textareaWithCounterAndRuleElement = new TextareaWithCounterAndRuleElement(
            textareaWithCounterElement, false);
        _textareaWithRuleElementCustomerDescription = new TextareaWithRuleElementCustomerDescription(
            textareaWithCounterAndRuleElement);
        _textareaWithRuleElementCustomerDescription.prepare();
    }
}

async function prepareFormElementCustomerEditProfile() {
    let form = document.getElementById("form_customer_edit_profile");
    let buttonSubmit = document.getElementById("button_submit_customer_edit_profile");
    let divMessageContainer = document.getElementById("div_message_container_customer_edit_profile");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementCustomerEditProfile = new FormElementCustomerEditProfile(form, buttonSubmit, divMessageContainer);
        _formElementCustomerEditProfile.setInputImgElementCustomerAvatar(_inputImgElementCustomerAvatar);
        _formElementCustomerEditProfile.setInputTextWithRuleElementCustomerNickname(_inputTextWithRuleElementCustomerNickname);
        _formElementCustomerEditProfile.setSelectWithRuleElementCountries(_selectWithRuleElementCountries);
        _formElementCustomerEditProfile.setTextareaElementWithRuleCustomerDescription(_textareaWithRuleElementCustomerDescription);
        _formElementCustomerEditProfile.setCustomerResponseDTO(_currentCustomer);

        await _formElementCustomerEditProfile.prepare();
    }
}
//---

// Элементы формы + форма "Изменение пароля пользователя" ---
function prepareInputPasswordWithRuleElementOld() {
    let inputPassword = document.getElementById("input_password_old");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);
        _inputPasswordWithRuleElementOld = new InputPasswordWithRuleElement(inputPasswordElement, true);
        _inputPasswordWithRuleElementOld.prepare();
    }
}

function prepareInputPasswordWithRuleElementCustomer() {
    let inputPassword = document.getElementById("input_password_new");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);
        let inputPasswordWithRuleElement = new InputPasswordWithRuleElement(
            inputPasswordElement, true);
        _inputPasswordWithRuleElementCustomerPassword = new InputPasswordWithRuleElementCustomerPassword(
            inputPasswordWithRuleElement);

        _inputPasswordWithRuleElementCustomerPassword.prepare();
    }
}

function prepareInputPasswordWithRuleElementRepeat() {
    let inputPassword = document.getElementById("input_password_repeat");
    if (inputPassword) {
        let inputPasswordElement = new InputPasswordElement(inputPassword);
        let inputPasswordWithRuleElement = new InputPasswordWithRuleElement(
            inputPasswordElement, true);
        _inputPasswordWithRuleElementRepeat = new InputPasswordWithRuleElementRepeat(
            inputPasswordWithRuleElement);
        _inputPasswordWithRuleElementRepeat.setFirstInputPasswordElement(
            _inputPasswordWithRuleElementCustomerPassword);

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
            [_inputPasswordWithRuleElementOld, _inputPasswordWithRuleElementCustomerPassword,
                _inputPasswordWithRuleElementRepeat]);

        _inputCheckboxElementShowPassword.prepare();
    }
}

async function prepareFormElementCustomerEditPassword() {
    let form = document.getElementById("form_customer_edit_password");
    let buttonSubmit = document.getElementById("button_submit_customer_edit_password");
    let divMessageContainer = document.getElementById("div_message_container_customer_edit_password");
    if (form && buttonSubmit && divMessageContainer) {
        _formElementCustomerEditPassword = new FormElementCustomerEditPassword(form, buttonSubmit, divMessageContainer);
        _formElementCustomerEditPassword.setInputPasswordWithRuleElementOld(_inputPasswordWithRuleElementOld);
        _formElementCustomerEditPassword.setInputPasswordWithRuleElementCustomerPassword(_inputPasswordWithRuleElementCustomerPassword);
        _formElementCustomerEditPassword.setInputPasswordWithRuleElementRepeat(_inputPasswordWithRuleElementRepeat);
        _formElementCustomerEditPassword.setInputCheckboxElementShowPassword(_inputCheckboxElementShowPassword);

        await _formElementCustomerEditPassword.prepare();
    }
}
//---