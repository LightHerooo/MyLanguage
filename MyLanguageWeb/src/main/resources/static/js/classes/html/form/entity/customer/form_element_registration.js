import {
    FormAbstractElement
} from "../../abstracts/form_abstract_element.js";

import {
    CustomersAPI
} from "../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerAddRequestDTO
} from "../../../../dto/entity/customer/request/customer_add_request_dto.js";

import {
    EventNames
} from "../../../event_names.js";

const _CUSTOMERS_API = new CustomersAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormElementRegistration extends FormAbstractElement {
    #inputTextWithRuleElementCustomerNicknameAdd;
    #selectWithRuleElementCountries;
    #inputTextWithRuleElementCustomerEmail;
    #inputTextWithRuleElementCustomerLogin;
    #inputPasswordWithRuleElementCustomerPassword;
    #inputPasswordWithRuleElementRepeat;
    #inputCheckboxElementShowPassword;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputTextWithRuleElementCustomerNicknameAdd(inputTextWithRuleElementCustomerNicknameAddObj) {
        this.#inputTextWithRuleElementCustomerNicknameAdd = inputTextWithRuleElementCustomerNicknameAddObj;
    }

    setSelectWithRuleElementCountries(selectWithRuleElementCountriesObj) {
        this.#selectWithRuleElementCountries = selectWithRuleElementCountriesObj;
    }

    setInputTextWithRuleElementCustomerEmail(inputTextWithRuleElementCustomerEmailObj) {
        this.#inputTextWithRuleElementCustomerEmail = inputTextWithRuleElementCustomerEmailObj;
    }

    setInputTextWithRuleElementCustomerLogin(inputTextWithRuleElementCustomerLoginObj) {
        this.#inputTextWithRuleElementCustomerLogin = inputTextWithRuleElementCustomerLoginObj;
    }

    setInputPasswordWithRuleElementCustomerPassword(inputPasswordWithRuleElementCustomerPasswordObj) {
        this.#inputPasswordWithRuleElementCustomerPassword = inputPasswordWithRuleElementCustomerPasswordObj;
    }

    setInputPasswordWithRuleElementRepeat(inputPasswordWithRuleElementRepeatObj) {
        this.#inputPasswordWithRuleElementRepeat = inputPasswordWithRuleElementRepeatObj;
    }

    setInputCheckboxElementShowPassword(inputCheckboxElementShowPasswordObj) {
        this.#inputCheckboxElementShowPassword = inputCheckboxElementShowPasswordObj;
    }


    async prepare() {
        await super.prepare();

        let inputTextWithRuleElementCustomerNicknameAdd = this.#inputTextWithRuleElementCustomerNicknameAdd;
        if (inputTextWithRuleElementCustomerNicknameAdd) {
            if (!inputTextWithRuleElementCustomerNicknameAdd.getIsPrepared()) {
                inputTextWithRuleElementCustomerNicknameAdd.prepare();
            }

            let inputText = inputTextWithRuleElementCustomerNicknameAdd.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            if (!selectWithRuleElementCountries.getIsPrepared()) {
                await selectWithRuleElementCountries.prepare();
                await selectWithRuleElementCountries.fill();
            }

            let select = selectWithRuleElementCountries.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.clearDivMessageContainer();
                })
            }
        }

        let inputTextWithRuleElementCustomerEmail = this.#inputTextWithRuleElementCustomerEmail;
        if (inputTextWithRuleElementCustomerEmail) {
            if (!inputTextWithRuleElementCustomerEmail.getIsPrepared()) {
                inputTextWithRuleElementCustomerEmail.prepare();
            }

            let inputText = inputTextWithRuleElementCustomerEmail.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let inputTextWithRuleElementCustomerLogin = this.#inputTextWithRuleElementCustomerLogin;
        if (inputTextWithRuleElementCustomerLogin) {
            if (!inputTextWithRuleElementCustomerLogin.getIsPrepared()) {
                inputTextWithRuleElementCustomerLogin.prepare();
            }

            let inputText = inputTextWithRuleElementCustomerLogin.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            if (!inputPasswordWithRuleElementCustomerPassword.getIsPrepared()) {
                inputPasswordWithRuleElementCustomerPassword.prepare();
            }

            let inputPassword = inputPasswordWithRuleElementCustomerPassword.getInputPassword();
            if (inputPassword) {
                let self = this;
                inputPassword.addEventListener(_EVENT_NAMES.INPUT.PASSWORD.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let inputPasswordWithRuleElementRepeat = this.#inputPasswordWithRuleElementRepeat;
        if (inputPasswordWithRuleElementRepeat) {
            if (!inputPasswordWithRuleElementRepeat.getIsPrepared()) {
                inputPasswordWithRuleElementRepeat.prepare();
            }

            let inputPassword = inputPasswordWithRuleElementRepeat.getInputPassword();
            if (inputPassword) {
                let self = this;
                inputPassword.addEventListener(_EVENT_NAMES.INPUT.PASSWORD.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let inputCheckboxElementShowPassword = this.#inputCheckboxElementShowPassword;
        if (inputCheckboxElementShowPassword) {
            if (!inputCheckboxElementShowPassword.getIsPrepared()) {
                inputCheckboxElementShowPassword.prepare();
                inputCheckboxElementShowPassword.changeLabelText("Показать пароль");
            }

            let inputCheckbox = inputCheckboxElementShowPassword.getInputCheckbox();
            if (inputCheckbox) {
                let self = this;
                inputCheckbox.addEventListener(_EVENT_NAMES.INPUT.CHECKBOX.CHANGE, function() {
                    self.clearDivMessageContainer();
                });
            }
        }
    }


    async checkCorrectValues() {
        let isNicknameCorrect = false;
        let inputTextWithRuleElementCustomerNicknameAdd = this.#inputTextWithRuleElementCustomerNicknameAdd;
        if (inputTextWithRuleElementCustomerNicknameAdd) {
            isNicknameCorrect = await inputTextWithRuleElementCustomerNicknameAdd.checkCorrectValue();
        }

        let isCountryCorrect = false;
        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            isCountryCorrect = await selectWithRuleElementCountries.checkCorrectValue();
        }

        let isEmailCorrect = false;
        let inputTextWithRuleElementCustomerEmail = this.#inputTextWithRuleElementCustomerEmail;
        if (inputTextWithRuleElementCustomerEmail) {
            isEmailCorrect = await inputTextWithRuleElementCustomerEmail.checkCorrectValue();
        }

        let isLoginCorrect = false;
        let inputTextWithRuleElementCustomerLogin = this.#inputTextWithRuleElementCustomerLogin;
        if (inputTextWithRuleElementCustomerLogin) {
            isLoginCorrect = await inputTextWithRuleElementCustomerLogin.checkCorrectValue();
        }

        let isPasswordCorrect = false;
        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            isPasswordCorrect = await inputPasswordWithRuleElementCustomerPassword.checkCorrectValue();
        }

        let isPasswordRepeatCorrect = false;
        let inputPasswordWithRuleElementRepeat = this.#inputPasswordWithRuleElementRepeat;
        if (inputPasswordWithRuleElementRepeat) {
            isPasswordRepeatCorrect = await inputPasswordWithRuleElementRepeat.checkCorrectValue();
        }

        return isNicknameCorrect && isCountryCorrect && isEmailCorrect && isLoginCorrect
            && isPasswordCorrect && isPasswordRepeatCorrect;
    }

    async submit() {
        let customerAddRequestDTO = new CustomerAddRequestDTO();

        let inputTextWithRuleElementCustomerNicknameAdd = this.#inputTextWithRuleElementCustomerNicknameAdd;
        if (inputTextWithRuleElementCustomerNicknameAdd) {
            customerAddRequestDTO.setNickname(inputTextWithRuleElementCustomerNicknameAdd.getValue());
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            customerAddRequestDTO.setCountryCode(selectWithRuleElementCountries.getSelectedValue());
        }

        let inputTextWithRuleElementCustomerEmail = this.#inputTextWithRuleElementCustomerEmail;
        if (inputTextWithRuleElementCustomerEmail) {
            customerAddRequestDTO.setEmail(inputTextWithRuleElementCustomerEmail.getValue());
        }

        let inputTextWithRuleElementCustomerLogin = this.#inputTextWithRuleElementCustomerLogin;
        if (inputTextWithRuleElementCustomerLogin) {
            customerAddRequestDTO.setLogin(inputTextWithRuleElementCustomerLogin.getValue());
        }

        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            customerAddRequestDTO.setPassword(inputPasswordWithRuleElementCustomerPassword.getValue());
        }

        let isCorrect = true;
        let ruleType;
        let message;
        let jsonResponse = await _CUSTOMERS_API.POST.register(customerAddRequestDTO);
        if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
        }

        if (!isCorrect) {
            this.showRule(ruleType, message);
        }

        return isCorrect;
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let inputTextWithRuleElementCustomerNicknameAdd = this.#inputTextWithRuleElementCustomerNicknameAdd;
        if (inputTextWithRuleElementCustomerNicknameAdd) {
            inputTextWithRuleElementCustomerNicknameAdd.changeReadOnlyStatus(isDisabled);
        }

        let selectWithRuleElementCountries = this.#selectWithRuleElementCountries;
        if (selectWithRuleElementCountries) {
            selectWithRuleElementCountries.changeReadOnlyStatus(isDisabled);
        }

        let inputTextWithRuleElementCustomerEmail = this.#inputTextWithRuleElementCustomerEmail;
        if (inputTextWithRuleElementCustomerEmail) {
            inputTextWithRuleElementCustomerEmail.changeReadOnlyStatus(isDisabled);
        }

        let inputTextWithRuleElementCustomerLogin = this.#inputTextWithRuleElementCustomerLogin;
        if (inputTextWithRuleElementCustomerLogin) {
            inputTextWithRuleElementCustomerLogin.changeReadOnlyStatus(isDisabled);
        }

        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            inputPasswordWithRuleElementCustomerPassword.changeReadOnlyStatus(isDisabled);
        }

        let inputPasswordWithRuleElementRepeat = this.#inputPasswordWithRuleElementRepeat;
        if (inputPasswordWithRuleElementRepeat) {
            inputPasswordWithRuleElementRepeat.changeReadOnlyStatus(isDisabled);
        }

        let inputCheckboxElementShowPassword = this.#inputCheckboxElementShowPassword;
        if (inputCheckboxElementShowPassword) {
            inputCheckboxElementShowPassword.changeDisabledStatus(isDisabled);
        }
    }
}