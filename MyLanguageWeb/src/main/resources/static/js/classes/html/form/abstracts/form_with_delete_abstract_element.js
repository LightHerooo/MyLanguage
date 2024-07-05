import {
    FormAbstractElement
} from "./form_abstract_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class FormWithDeleteAbstractElement extends FormAbstractElement {
    #buttonWithTextElementDoubleClickDelete;

    constructor(form, buttonSubmit, divMessageContainer, buttonWithTextElementDoubleClickObjDelete) {
        super(form, buttonSubmit, divMessageContainer);
        if (this.constructor === FormWithDeleteAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#buttonWithTextElementDoubleClickDelete = buttonWithTextElementDoubleClickObjDelete;
    }

    async prepare() {
        await super.prepare();

        let buttonWithTextElementDoubleClickDelete = this.#buttonWithTextElementDoubleClickDelete;
        if (buttonWithTextElementDoubleClickDelete) {
            if (!buttonWithTextElementDoubleClickDelete.getIsPrepared()) {
                buttonWithTextElementDoubleClickDelete.prepare();
            }

            let self = this;
            buttonWithTextElementDoubleClickDelete.setAfterDoubleClickFunction(async function() {
                self.changeDisabledStatusToFormElements(true);

                let form = self.getForm();
                if (form && await self.delete()) {
                    buttonWithTextElementDoubleClickDelete.turnOff(true);

                    if (form.action && form.action.slice(-1) !== '#') {
                        if (!form.method || form.method.toUpperCase() === "GET") {
                            window.location = form.action;
                        } else {
                            form.submit();
                        }
                    }
                } else {
                    buttonWithTextElementDoubleClickDelete.refresh();
                    self.changeDisabledStatusToFormElements(false);
                }
            })
        }
    }

    async delete() {
        this.showRule(_RULE_TYPES.ERROR, "Удаление через форму не подготовлено");
        return false;
    }

    changeDisabledStatusToFormElements(isDisabled) {
        super.changeDisabledStatusToFormElements(isDisabled);

        let buttonWithTextElementDoubleClickDelete = this.#buttonWithTextElementDoubleClickDelete;
        if (buttonWithTextElementDoubleClickDelete) {
            buttonWithTextElementDoubleClickDelete.changeDisabledStatus(isDisabled);
        }
    }
}