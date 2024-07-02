import {
    FormAbstractElement
} from "../../abstracts/form_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

const _EVENT_NAMES = new EventNames();

export class FormElementEntry extends FormAbstractElement {
    #inputTextElementLogin;
    #inputPasswordElement;
    #inputCheckboxElementShowPassword;

    constructor(form, buttonSubmit, divMessageContainer) {
        super(form, buttonSubmit, divMessageContainer);
    }

    setInputTextElementLogin(inputTextElementLoginObj) {
        this.#inputTextElementLogin = inputTextElementLoginObj;
    }

    setInputPasswordElement(inputPasswordElementObj) {
        this.#inputPasswordElement = inputPasswordElementObj;
    }

    setInputCheckboxElementShowPassword(inputCheckboxElementShowPasswordObj) {
        this.#inputCheckboxElementShowPassword = inputCheckboxElementShowPasswordObj;
    }


    async prepare() {
        await super.prepare();

        let inputTextElementLogin = this.#inputTextElementLogin;
        if (inputTextElementLogin) {
            let inputText = inputTextElementLogin.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, function() {
                    self.clearDivMessageContainer();
                });
            }
        }

        let inputPasswordElement = this.#inputPasswordElement;
        if (inputPasswordElement) {
            let inputPassword = inputPasswordElement.getInputPassword();
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


    async submit() {
        return true;
    }


    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let inputTextElementLogin = this.#inputTextElementLogin;
        if (inputTextElementLogin) {
            inputTextElementLogin.changeReadOnlyStatus(isDisabled);
        }

        let inputPasswordElement = this.#inputPasswordElement;
        if (inputPasswordElement) {
            inputPasswordElement.changeReadOnlyStatus(isDisabled);
        }

        let inputCheckboxElementShowPassword = this.#inputCheckboxElementShowPassword;
        if (inputCheckboxElementShowPassword) {
            inputCheckboxElementShowPassword.changeDisabledStatus(isDisabled);
        }
    }
}