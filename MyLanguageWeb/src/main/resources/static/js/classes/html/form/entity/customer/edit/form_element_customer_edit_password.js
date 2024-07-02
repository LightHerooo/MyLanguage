import {
    FormAbstractElement
} from "../../../abstracts/form_abstract_element.js";

import {
    CustomersAPI
} from "../../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerEditPasswordRequestDTO
} from "../../../../../dto/entity/customer/request/edit/customer_edit_password_request_dto.js";

import {
    EventNames
} from "../../../../event_names.js";

const _CUSTOMERS_API = new CustomersAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormElementCustomerEditPassword extends FormAbstractElement {
    #inputPasswordWithRuleElementOld;
    #inputPasswordWithRuleElementCustomerPassword;
    #inputPasswordWithRuleElementRepeat;
    #inputCheckboxElementShowPassword;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputPasswordWithRuleElementOld(inputPasswordWithRuleElementObjOld) {
        this.#inputPasswordWithRuleElementOld = inputPasswordWithRuleElementObjOld;
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

        let inputPasswordWithRuleElementOld = this.#inputPasswordWithRuleElementOld;
        if (inputPasswordWithRuleElementOld) {
            if (!inputPasswordWithRuleElementOld.getIsPrepared()) {
                inputPasswordWithRuleElementOld.prepare();
            }

            let inputPassword = inputPasswordWithRuleElementOld.getInputPassword();
            if (inputPassword) {
                let self = this;
                inputPassword.addEventListener(_EVENT_NAMES.INPUT.PASSWORD.INPUT, function() {
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
        let isOldPasswordCorrect = false;
        let inputPasswordWithRuleElementOld = this.#inputPasswordWithRuleElementOld;
        if (inputPasswordWithRuleElementOld) {
            isOldPasswordCorrect = await inputPasswordWithRuleElementOld.checkCorrectValue();
        }

        let isNewPasswordCorrect = false;
        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            isNewPasswordCorrect = await inputPasswordWithRuleElementCustomerPassword.checkCorrectValue();
        }

        let isNewPasswordRepeatCorrect = false;
        let inputPasswordWithRuleElementRepeat = this.#inputPasswordWithRuleElementRepeat;
        if (inputPasswordWithRuleElementRepeat) {
            isNewPasswordRepeatCorrect = await inputPasswordWithRuleElementRepeat.checkCorrectValue();
        }

        return isOldPasswordCorrect && isNewPasswordCorrect && isNewPasswordRepeatCorrect;
    }

    async submit() {
        let dto = new CustomerEditPasswordRequestDTO();

        let inputPasswordWithRuleElementOld = this.#inputPasswordWithRuleElementOld;
        if (inputPasswordWithRuleElementOld) {
            dto.setOldPassword(inputPasswordWithRuleElementOld.getValue());
        }

        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            dto.setNewPassword(inputPasswordWithRuleElementCustomerPassword.getValue());
        }

        // Пробуем изменить пароль ---
        let isCorrect;
        let ruleType;
        let message;
        let jsonResponse = await _CUSTOMERS_API.PATCH.editPassword(dto);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            isCorrect = true;
            ruleType = _RULE_TYPES.ACCEPT;
            message = `${new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage()}`;
        }  else {
            isCorrect = false;
            ruleType = _RULE_TYPES.ERROR;
            message = `${new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage()}`;
        }
        //---

        // Отображаем сообщение при любом раскладе ---
        this.showRule(ruleType, message);
        //---

        return isCorrect;
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let inputPasswordWithRuleElementOld = this.#inputPasswordWithRuleElementOld;
        if (inputPasswordWithRuleElementOld) {
            inputPasswordWithRuleElementOld.changeDisabledStatus(isDisabled);
        }

        let inputPasswordWithRuleElementCustomerPassword = this.#inputPasswordWithRuleElementCustomerPassword;
        if (inputPasswordWithRuleElementCustomerPassword) {
            inputPasswordWithRuleElementCustomerPassword.changeDisabledStatus(isDisabled);
        }

        let inputPasswordWithRuleElementRepeat = this.#inputPasswordWithRuleElementRepeat;
        if (inputPasswordWithRuleElementRepeat) {
            inputPasswordWithRuleElementRepeat.changeDisabledStatus(isDisabled);
        }

        let inputCheckboxElementShowPassword = this.#inputCheckboxElementShowPassword;
        if (inputCheckboxElementShowPassword) {
            inputCheckboxElementShowPassword.changeDisabledStatus(isDisabled);
        }
    }
}