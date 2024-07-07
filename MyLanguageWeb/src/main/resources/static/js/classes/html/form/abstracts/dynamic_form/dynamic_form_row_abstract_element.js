import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    ButtonWithImgElementDoubleClick
} from "../../../button/with_img/button_with_img_element_double_click.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    CssDynamicFormElement
} from "../../../../css/elements/form/css_dynamic_form_element.js";

import {
    DynamicFormRowDataAbstractElement
} from "./dynamic_form_row_data_abstract_element.js";

import {
    DivAbstractElement
} from "../../../div/abstracts/div_abstract_element.js";

const _CSS_DYNAMIC_FORM_ELEMENT = new CssDynamicFormElement();

const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();

export class DynamicFormRowAbstractElement extends DivAbstractElement {
    #dynamicFormRowDataElement;
    #buttonWithImgElementDoubleClickDelete;

    constructor(div) {
        super(div);
        if (this.constructor === DynamicFormRowAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#tryToSetDefaultValues();
    }

    getDynamicFormRowDataElement() {
        return this.#dynamicFormRowDataElement;
    }

    getButtonWithImgElementDoubleClickDelete() {
        return this.#buttonWithImgElementDoubleClickDelete;
    }


    #tryToSetDefaultValues() {
        // Данные строки ---
        let dynamicFormRowDataElement = this.#dynamicFormRowDataElement;
        if (!dynamicFormRowDataElement) {
            dynamicFormRowDataElement = this.createDynamicFormRowDataElementObject();
        }
        //---

        // Кнопка "Удалить" ---
        let buttonWithImgElementDoubleClickDelete = this.#buttonWithImgElementDoubleClickDelete;
        if (!buttonWithImgElementDoubleClickDelete) {
            let buttonWithImgElement = new ButtonWithImgElement(null, null);
            buttonWithImgElementDoubleClickDelete = new ButtonWithImgElementDoubleClick(buttonWithImgElement);
            buttonWithImgElementDoubleClickDelete.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            buttonWithImgElementDoubleClickDelete.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DELETE);

            let button = buttonWithImgElementDoubleClickDelete.getButton();
            if (button) {
                button.type = "button";
            }
        }
        //---

        this.#dynamicFormRowDataElement = dynamicFormRowDataElement;
        this.#buttonWithImgElementDoubleClickDelete = buttonWithImgElementDoubleClickDelete;
    }


    async prepare() {
        await super.prepare();

        let dynamicFormRowDataElement = this.#dynamicFormRowDataElement;
        if (dynamicFormRowDataElement) {
            if (!dynamicFormRowDataElement.getIsPrepared()) {
                dynamicFormRowDataElement.prepare();
                await dynamicFormRowDataElement.fill();
            }
        }

        // Кнопка "Удалить строку" ---
        let buttonWithImgElementDoubleClickDelete = this.#buttonWithImgElementDoubleClickDelete;
        if (buttonWithImgElementDoubleClickDelete) {
            if (!buttonWithImgElementDoubleClickDelete.getIsPrepared()) {
                buttonWithImgElementDoubleClickDelete.prepare();
            }
        }
        //---
    }


    async tryToCreateContent() {
        let div = document.createElement("div");
        div.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_ROW_CONTAINER_CLASS_ID);

        // Данные строки ---
        let dynamicFormRowDataElement = this.#dynamicFormRowDataElement;
        if (dynamicFormRowDataElement) {
            let divData = dynamicFormRowDataElement.getDiv();
            if (divData) {
                divData.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_ROW_DATA_CONTAINER_CLASS_ID);
                div.appendChild(divData);
            }
        }
        //---

        // Кнопка "Удалить" ---
        let buttonWithImgElementDoubleClickDelete = this.#buttonWithImgElementDoubleClickDelete;
        if (buttonWithImgElementDoubleClickDelete) {
            let button = buttonWithImgElementDoubleClickDelete.getButton();
            if (button) {
                div.appendChild(button);
            }
        }
        //---

        return div;
    }


    createDynamicFormRowDataElementObject() {
        return new DynamicFormRowDataAbstractElement(null);
    }


    changeDisabledStatusToRowElements(isDisabled) {
        let dynamicFormRowDataElement = this.#dynamicFormRowDataElement;
        if (dynamicFormRowDataElement) {
            dynamicFormRowDataElement.changeDisabledStatusToRowDataElements(isDisabled);
        }

        let buttonWithImgElementDoubleClickDelete = this.#buttonWithImgElementDoubleClickDelete;
        if (buttonWithImgElementDoubleClickDelete) {
            buttonWithImgElementDoubleClickDelete.changeDisabledStatus(isDisabled);
        }
    }
}