import {
    CssFormElement
} from "../../../css/form/css_form_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

import {
    SpanLoadingElement
} from "../../span/elements/span_loading_element.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    CssDivElement
} from "../../../css/div/css_div_element.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_FORM_ELEMENT = new CssFormElement();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class FormAbstractElement {
    #form;
    #buttonSubmit;
    #buttonReset;
    #divMessageContainer;

    #isPrepared = false;

    constructor(form, buttonSubmit, divMessageContainer) {
        if (this.constructor === FormAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#form = form;
        this.#buttonSubmit = buttonSubmit;
        this.#divMessageContainer = divMessageContainer;

        this.#tryToSetDefaultValues();
    }

    getForm() {
        return this.#form;
    }

    setButtonReset(buttonReset) {
        this.#buttonReset = buttonReset;
    }


    #tryToSetDefaultValues() {
        let form = this.#form;
        if (!form) {
            form = document.createElement("form");
            form.classList.add(_CSS_FORM_ELEMENT.FORM_ELEMENT_CLASS_ID);
        }

        let buttonSubmit = this.#buttonSubmit;
        if (!buttonSubmit) {
            buttonSubmit = document.createElement("button");
            buttonSubmit.classList.add(_CSS_FORM_ELEMENT.BUTTON_SUBMIT_CLASS_ID);
            buttonSubmit.type = "submit";
            buttonSubmit.textContent = "Отправить";
        }

        let divMessageContainer = this.#divMessageContainer;
        if (!divMessageContainer) {
            divMessageContainer = document.createElement("div");
            divMessageContainer.classList.add(_CSS_FORM_ELEMENT.DIV_FORM_ELEMENT_MESSAGE_CONTAINER_CLASS_ID);
        }


        // Добавляем элементы в форму, если у них нет родителя ---
        if (!buttonSubmit.parentElement) {
            // Горизонтальный разделитель ---
            let div = document.createElement("div");
            div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_HORIZONTAL_DELIMITER_CLASS_ID);

            form.appendChild(div);
            //---

            // Если кнопка "Сбросить" передана, то мы должны создать для кнопок специальный контейнер ---
            let buttonReset = this.#buttonReset;
            if (buttonReset) {
                div = document.createElement("div");
                div.classList.add(_CSS_FORM_ELEMENT.DIV_FORM_ELEMENT_ACTIONS_CONTAINER);

                div.appendChild(buttonSubmit);
                div.appendChild(buttonReset);

                form.appendChild(div);
                //---
            } else {
                // Если кнопка "Сбросить" не передана, добавляем только кнопку "Отправить" ---
                form.appendChild(buttonSubmit);
                //---
            }
        }
        //---

        this.#form = form;
        this.#buttonSubmit = buttonSubmit;
        this.#divMessageContainer = divMessageContainer;
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let form = this.#form;
            if (form) {
                let self = this;
                form.addEventListener(_EVENT_NAMES.FORM.SUBMIT, async function (e) {
                    self.changeDisabledStatusToFormElements(true);
                    e.preventDefault();

                    self.showLoading();

                    if (await self.checkCorrectValues()) {
                        if (await self.submit()) {
                            window.onbeforeunload = null;

                            if (form.action && form.action.slice(-1) !== '#') {
                                if (!form.method || form.method.toUpperCase() === "GET") {
                                    window.location = form.action;
                                } else {
                                    form.submit();
                                }
                            } else {
                                self.changeDisabledStatusToFormElements(false);
                            }
                        } else {
                            self.changeDisabledStatusToFormElements(false);
                        }
                    } else {
                        self.clearDivMessageContainer();
                        self.changeDisabledStatusToFormElements(false);
                    }
                });

                form.onreset = async function() {
                    self.changeDisabledStatusToFormElements(true);
                    self.showLoading();

                    await self.reset()

                    self.clearDivMessageContainer();
                    self.changeDisabledStatusToFormElements(false);
                }
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'FormAbstractElement\' has already been prepared.");
        }
    }


    showLoading() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.clearDivMessageContainer();

            let divMessageContainer = this.#divMessageContainer;
            if (divMessageContainer) {
                divMessageContainer.appendChild(new SpanLoadingElement(null).getSpan());
            }
        } else {
            throw new Error("Object \'FormAbstractElement\' is not prepared.");
        }
    }

    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.clearDivMessageContainer();

            let divMessageContainer = this.#divMessageContainer;
            if (divMessageContainer) {
                divMessageContainer.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());
            }
        } else {
            throw new Error("Object \'FormAbstractElement\' is not prepared.");
        }
    }

    clearDivMessageContainer() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let divMessageContainer = this.#divMessageContainer;
            if (divMessageContainer) {
                divMessageContainer.replaceChildren();
            }
        } else {
            throw new Error("Object \'FormAbstractElement\' is not prepared.");
        }
    }

    changeDisabledStatusToFormElements(isDisabled) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let buttonSubmit = this.#buttonSubmit;
            if (buttonSubmit) {
                buttonSubmit.disabled = isDisabled;
            }

            let buttonReset = this.#buttonReset;
            if (buttonReset) {
                buttonReset.disabled = isDisabled;
            }
        } else {
            throw new Error("Object \'FormAbstractElement\' is not prepared.");
        }
    }


    async checkCorrectValues() {
        return true;
    }

    async submit() {
        this.showRule("Отправка формы не подготовлена", _RULE_TYPES.ERROR);
        return false;
    }

    async reset() {
        this.showRule("Сброс формы не подготовлен", _RULE_TYPES.ERROR);
    }
}