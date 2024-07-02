import {
    InputCheckboxElement
} from "../input_checkbox_element.js";

import {
    EventNames
} from "../../../event_names.js";

const _EVENT_NAMES = new EventNames();

export class InputCheckboxElementShowPassword extends InputCheckboxElement {
    #inputPasswordElementsArr = [];

    constructor(inputCheckboxElementObj, inputPasswordElementObjsArr) {
        super(inputCheckboxElementObj.getDivContainer(), inputCheckboxElementObj.getInputCheckbox(), inputCheckboxElementObj.getLabel());
        this.#inputPasswordElementsArr = inputPasswordElementObjsArr;
    }

    prepare() {
        super.prepare();

        let self = this;
        let inputCheckbox = this.getInputCheckbox();
        if (inputCheckbox) {
            inputCheckbox.addEventListener(_EVENT_NAMES.INPUT.CHECKBOX.CHANGE, function() {
                let inputPasswordElementsArr = self.#inputPasswordElementsArr;
                if (inputPasswordElementsArr) {
                    for (let inputPasswordElement of inputPasswordElementsArr) {
                        let inputPassword = inputPasswordElement.getInputPassword();
                        if (inputPassword) {
                            inputPassword.type = self.getIsChecked() ? "text" : "password";
                        }
                    }
                }
            });
        }
    }
}