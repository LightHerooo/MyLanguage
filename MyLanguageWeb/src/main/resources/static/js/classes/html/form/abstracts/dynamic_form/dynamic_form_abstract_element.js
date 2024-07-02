import {
    CssDynamicFormElement
} from "../../../../css/form/css_dynamic_form_element.js";

import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    SpanRuleElement
} from "../../../span/elements/rule/span_rule_element.js";

import {
    SpanLoadingElement
} from "../../../span/elements/span_loading_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    DynamicFormRowAbstractElement
} from "./dynamic_form_row_abstract_element.js";

import {
    EventNames
} from "../../../event_names.js";

const _CSS_DYNAMIC_FORM_ELEMENT = new CssDynamicFormElement();

const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class DynamicFormAbstractElement {
    #form;
    #divRowsContainer;
    #divButtonAddRowContainer;
    #divMessageContainer;
    #buttonSubmit;

    #minNumberOfRows = 0;
    #maxNumberOfRows = 0;

    #defaultButtonAddRowTitle = "Добавить строку";
    #defaultButtonDeleteRowTitle = "Удалить строку";
    #buttonWithImgElementAddRow;
    #isPrepared = false;

    #currentRowNumber = 0;
    #dynamicFormRowElementsMap = new Map();

    constructor(form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit) {
        if (this.constructor === DynamicFormAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#form = form;
        this.#divRowsContainer = divRowsContainer;
        this.#divButtonAddRowContainer = divButtonAddRowContainer
        this.#divMessageContainer = divMessageContainer;
        this.#buttonSubmit = buttonSubmit;

        this.#tryToSetDefaultValues();
    }

    getForm() {
        return this.#form;
    }

    setMinNumberOfRows(value) {
        this.#minNumberOfRows = value;
    }

    setMaxNumberOfRows(value) {
        this.#maxNumberOfRows = value;
    }

    getDynamicFormRowElementsMap() {
        return this.#dynamicFormRowElementsMap;
    }


    #tryToSetDefaultValues() {
        // Форма ---
        let form = this.#form;
        if (!form) {
            form = document.createElement("form");
            form.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.FORM_DYNAMIC_FORM_ELEMENT_CLASS_ID);
        }
        //---

        // Контейнер для строк ---
        let divRowsContainer = this.#divRowsContainer;
        if (!divRowsContainer) {
            divRowsContainer = document.createElement("div");
            divRowsContainer.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_ROWS_CONTAINER_CLASS_ID);
        }
        //---

        // Контейнер для кнопки "Добавить строку" ---
        let divButtonAddRowContainer = this.#divButtonAddRowContainer;
        if (!divButtonAddRowContainer) {
            divButtonAddRowContainer = document.createElement("div");
            divButtonAddRowContainer.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_BUTTON_ADD_ROW_CONTAINER_CLASS_ID);
        }
        //---

        // Кнопка "Добавить строку ---
        let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
        if (!buttonWithImgElementAddRow) {
            buttonWithImgElementAddRow = new ButtonWithImgElement(null, null);
            buttonWithImgElementAddRow.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            buttonWithImgElementAddRow.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ADD);
            buttonWithImgElementAddRow.changeTitle(this.#defaultButtonAddRowTitle);

            let button = buttonWithImgElementAddRow.getButton();
            if (button) {
                button.type = "button";
            }
        }

        let button = buttonWithImgElementAddRow.getButton();
        if (button && !button.parentElement) {
            divButtonAddRowContainer.appendChild(button);
        }
        //---

        let divMessageContainer = this.#divMessageContainer;
        if (!divMessageContainer) {
            divMessageContainer = document.createElement("div");
            divMessageContainer.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_MESSAGE_CONTAINER_CLASS_ID);
        }

        let buttonSubmit = this.#buttonSubmit;
        if (!buttonSubmit) {
            buttonSubmit = document.createElement("button");
            buttonSubmit.type = "submit";
            buttonSubmit.textContent = "Отправить";
        }


        // Добавляем элементы в форму, если они не имеют родителя ---
        if (divRowsContainer && !divRowsContainer.parentElement) {
            form.appendChild(divRowsContainer);
        }

        if (divButtonAddRowContainer && !divButtonAddRowContainer.parentElement) {
            form.appendChild(divButtonAddRowContainer);
        }

        if ((divMessageContainer && !divMessageContainer.parentElement)
            && (buttonSubmit && !buttonSubmit.parentElement)) {
            let div = document.createElement("div");
            div.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_SUBMIT_CONTAINER_CLASS_ID);

            div.appendChild(divMessageContainer);
            div.appendChild(buttonSubmit);

            form.appendChild(div);
        }
        //---

        this.#form = form;
        this.#divRowsContainer = divRowsContainer;
        this.#divButtonAddRowContainer = divButtonAddRowContainer;
        this.#buttonWithImgElementAddRow = buttonWithImgElementAddRow;
        this.#divMessageContainer = divMessageContainer;
        this.#buttonSubmit = buttonSubmit;
    }

    #checkCorrectNumberOfRowsAfterAction() {
        // Проверка минимального количества строк ---
        let isMinNumberOfRowsCorrect = true;

        let minNumberOfRows = this.#minNumberOfRows;
        let dynamicFormRowElementsMap = this.#dynamicFormRowElementsMap;
        if (dynamicFormRowElementsMap) {
            if (minNumberOfRows > 0
                && dynamicFormRowElementsMap.size <= minNumberOfRows) {
                // Если количество строк достигло минимального,
                // мы должны заблокировать кнопки удаления и разблокировать кнопку добавления ---
                isMinNumberOfRowsCorrect = false;

                let minNumberOfRowsMessage = `Количество строк не может быть меньше ${minNumberOfRows}`;
                for (let key of dynamicFormRowElementsMap.keys()) {
                    let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                    if (dynamicFormRowElement) {
                        let buttonWithImgElementDoubleClickDelete = dynamicFormRowElement.getButtonWithImgElementDoubleClickDelete();
                        if (buttonWithImgElementDoubleClickDelete) {
                            buttonWithImgElementDoubleClickDelete.changeDisabledStatus(true);
                            buttonWithImgElementDoubleClickDelete.changeTitle(minNumberOfRowsMessage);
                            buttonWithImgElementDoubleClickDelete.turnOff();
                        }
                    }
                }

                let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
                if (buttonWithImgElementAddRow) {
                    buttonWithImgElementAddRow.changeDisabledStatus(false);
                    buttonWithImgElementAddRow.changeTitle(this.#defaultButtonAddRowTitle);
                }
                //---
            }
        }
        //---

        // Проверка максимального количества строк ---
        let isMaxNumberOfRowsCorrect = true;
        let maxNumberOfRows = this.#maxNumberOfRows;
        if (dynamicFormRowElementsMap) {
            if (maxNumberOfRows > 0
                && dynamicFormRowElementsMap.size >= maxNumberOfRows) {
                // Если количество строк достигло максимального,
                // мы должны заблокировать кнопку добавления строк и раблокировать строки удаления ---
                isMaxNumberOfRowsCorrect = false;

                let maxNumberOfRowsMessage = `Количество строк не может быть больше ${maxNumberOfRows}`;
                let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
                if (buttonWithImgElementAddRow) {
                    buttonWithImgElementAddRow.changeDisabledStatus(true);
                    buttonWithImgElementAddRow.changeTitle(maxNumberOfRowsMessage);
                }

                for (let key of dynamicFormRowElementsMap.keys()) {
                    let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                    if (dynamicFormRowElement) {
                        let buttonWithImgElementDoubleClickDelete = dynamicFormRowElement.getButtonWithImgElementDoubleClickDelete();
                        if (buttonWithImgElementDoubleClickDelete) {
                            buttonWithImgElementDoubleClickDelete.changeDisabledStatus(false);
                            buttonWithImgElementDoubleClickDelete.changeTitle(this.#defaultButtonDeleteRowTitle);
                            buttonWithImgElementDoubleClickDelete.refresh();
                        }
                    }
                }
                //---
            }
        }
        //---

        // Если минимальное и максимальное количество строк корректно,
        // мы должны разблокировать все элементы ---
        if (dynamicFormRowElementsMap) {
            if (isMinNumberOfRowsCorrect && isMaxNumberOfRowsCorrect) {
                for (let key of dynamicFormRowElementsMap.keys()) {
                    let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                    if (dynamicFormRowElement) {
                        let buttonWithImgElementDoubleClickDelete = dynamicFormRowElement.getButtonWithImgElementDoubleClickDelete();
                        if (buttonWithImgElementDoubleClickDelete) {
                            buttonWithImgElementDoubleClickDelete.changeDisabledStatus(false);
                            buttonWithImgElementDoubleClickDelete.changeTitle(this.#defaultButtonDeleteRowTitle);
                            buttonWithImgElementDoubleClickDelete.refresh();
                        }
                    }
                }
                //---

                let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
                if (buttonWithImgElementAddRow) {
                    buttonWithImgElementAddRow.changeDisabledStatus(false);
                    buttonWithImgElementAddRow.changeTitle(this.#defaultButtonAddRowTitle);
                }
            }
        }
        //---

        return isMinNumberOfRowsCorrect && isMaxNumberOfRowsCorrect;
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            // Минимальное количество строк не должно превышать максимальное ---
            let minNumberOfRows = this.#minNumberOfRows;
            let maxNumberOfRows = this.#maxNumberOfRows;
            if (minNumberOfRows > 0
                && maxNumberOfRows > 0
                && minNumberOfRows > maxNumberOfRows) {
                throw new Error("The minimum number of rows cannot be more than the maximum number of rows");
            }
            //---

            // Форма ---
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
                            if (form.action) {
                                form.submit();
                            }
                        } else {
                            self.changeDisabledStatusToFormElements(false);
                        }
                    } else {
                        self.clearDivMessageContainer();
                        self.changeDisabledStatusToFormElements(false);
                    }
                });
            }
            //---

            // Кнопка "Добавить новый элемент" ---
            let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
            if (buttonWithImgElementAddRow) {
                let button = buttonWithImgElementAddRow.getButton();
                if (button) {
                    let self = this;
                    button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                        self.changeDisabledStatusToFormElements(true);
                        self.clearDivMessageContainer();

                        await self.tryToAddNewRow();

                        self.changeDisabledStatusToFormElements(false);
                    });
                }
            }
            //---

            // Добавляем минимальное количество строк ---
            if (minNumberOfRows > 0) {
                for (let i = 0; i < minNumberOfRows; i++) {
                    await this.tryToAddNewRow();
                }
            }
            //---

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'DynamicFormAbstractElement\' has already been prepared.");
        }
    }


    async tryToAddNewRow() {
        let isCorrect = true;
        let maxNumberOfRows = this.#maxNumberOfRows;
        let dynamicFormRowElementsMap = this.#dynamicFormRowElementsMap;
        if (maxNumberOfRows > 0
            && dynamicFormRowElementsMap.size >= maxNumberOfRows) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.WARNING,`Количество строк не может быть больше ${maxNumberOfRows}`);
        }

        if (isCorrect) {
            let dynamicFormRowElement = this.createDynamicFormRowElementObject();
            if (dynamicFormRowElement) {
                await dynamicFormRowElement.prepare();
                await dynamicFormRowElement.fill();

                // Добавляем элемент в мапу ---
                let currentRowNumber = ++this.#currentRowNumber;
                let dynamicFormRowElementsMap = this.#dynamicFormRowElementsMap;
                if (dynamicFormRowElementsMap) {
                    dynamicFormRowElementsMap.set(currentRowNumber, dynamicFormRowElement);
                }
                //---

                // Настраиваем кнопку удаления ---
                let buttonWithImgElementDoubleClickDelete = dynamicFormRowElement.getButtonWithImgElementDoubleClickDelete();
                if (buttonWithImgElementDoubleClickDelete) {
                    let self = this;
                    let button = buttonWithImgElementDoubleClickDelete.getButton();
                    if (button) {
                        button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function() {
                            self.clearDivMessageContainer();
                        })
                    }

                    buttonWithImgElementDoubleClickDelete.setAfterDoubleClickFunction(function() {
                        self.changeDisabledStatusToFormElements(true);

                        self.tryToDeleteRow(currentRowNumber);

                        self.changeDisabledStatusToFormElements(false);
                    });
                }
                //---

                // Добавляем контейнер в форму ---
                let div = dynamicFormRowElement.getDiv();
                if (div) {
                    let divRowsContainer = this.#divRowsContainer;
                    if (divRowsContainer) {
                        divRowsContainer.appendChild(div);
                    }
                }
                //---
            }

            this.#checkCorrectNumberOfRowsAfterAction();
        }
    }

    tryToDeleteRow(key) {
        let isCorrect = true;

        let minNumberOfRows = this.#minNumberOfRows;
        let dynamicFormRowElementsMap = this.#dynamicFormRowElementsMap;
        if (dynamicFormRowElementsMap) {
            if (minNumberOfRows > 0
                && dynamicFormRowElementsMap.size <= minNumberOfRows) {
                isCorrect = false;
                this.showRule(_RULE_TYPES.WARNING, `Количество строк не может быть меньше ${minNumberOfRows}`);
            }
        }

        if (isCorrect) {
            // Удаляем элемент из контейнера и мапы ---
            let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
            if (dynamicFormRowElement) {
                let div = dynamicFormRowElement.getDiv();
                if (div) {
                    let parentElement = div.parentElement;
                    if (parentElement) {
                        parentElement.removeChild(div);
                    }
                }
            }

            dynamicFormRowElementsMap.delete(key);
            //---

            this.#checkCorrectNumberOfRowsAfterAction();
        }
    }


    async checkCorrectValues() {
        return true;
    }

    async submit() {
        this.showRule("Отправка формы не подготовлена", _RULE_TYPES.ERROR);
        return false;
    }


    createDynamicFormRowElementObject() {
        return new DynamicFormRowAbstractElement();
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
            throw new Error("Object \'DynamicFormAbstractElement\' is not prepared.");
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
            throw new Error("Object \'DynamicFormAbstractElement\' is not prepared.");
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
            throw new Error("Object \'DynamicFormAbstractElement\' is not prepared.");
        }
    }

    changeDisabledStatusToFormElements(isDisabled) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let buttonSubmit = this.#buttonSubmit;
            if (buttonSubmit) {
                buttonSubmit.disabled = isDisabled;
            }

            let buttonWithImgElementAddRow = this.#buttonWithImgElementAddRow;
            if (buttonWithImgElementAddRow) {
                buttonWithImgElementAddRow.changeDisabledStatus(isDisabled);
            }

            let dynamicFormRowElementsMap = this.#dynamicFormRowElementsMap;
            if (dynamicFormRowElementsMap) {
                for (let key of dynamicFormRowElementsMap.keys()) {
                    let dynamicFormRowElement = dynamicFormRowElementsMap.get(key);
                    if (dynamicFormRowElement) {
                        dynamicFormRowElement.changeDisabledStatusToRowElements(isDisabled);
                    }
                }
            }

            // Если влючаем элементы, проверяем корректность количества строк ---
            if (!isDisabled) {
                this.#checkCorrectNumberOfRowsAfterAction();
            }
            //---
        } else {
            throw new Error("Object \'DynamicFormAbstractElement\' is not prepared.");
        }
    }
}

