import {
    DynamicFormRowDataAbstractElement
} from "../../abstracts/dynamic_form/dynamic_form_row_data_abstract_element.js";

import {
    SelectWithRuleElementLangsIn
} from "../../../select/entity/lang/in/select_with_rule_element_langs_in.js";

import {
    InputTextWithRuleElementWordTitle
} from "../../../input/text/entity/word/input_text_with_rule_element_word_title.js";

import {
    InputTextElement
} from "../../../input/text/input_text_element.js";

import {
    CssDynamicFormElement
} from "../../../../css/form/css_dynamic_form_element.js";

import {
    LabelRequiredElement
} from "../../../label/label_required_element.js";

import {
    InputTextWithRuleElement
} from "../../../input/text/input_text_with_rule_element.js";

const _CSS_DYNAMIC_FORM_ELEMENT = new CssDynamicFormElement();

export class DynamicFormRowDataElementNewWord extends DynamicFormRowDataAbstractElement {
    #inputTextWithRuleElementWordTitle;
    #selectWithRuleElementLangsIn;

    constructor(div) {
        super(div);

        this.#tryToSetDefaultValues();
    }

    getInputTextWithRuleElementWordTitle() {
        return this.#inputTextWithRuleElementWordTitle;
    }

    getSelectWithRuleElementLangsIn() {
        return this.#selectWithRuleElementLangsIn;
    }


    #tryToSetDefaultValues() {
        let selectWithRuleElementLangsIn = this.#selectWithRuleElementLangsIn;
        if (!selectWithRuleElementLangsIn) {
            selectWithRuleElementLangsIn = new SelectWithRuleElementLangsIn(
                null, null, null, true, true);
        }

        let inputTextWithRuleElementWordTitle = this.#inputTextWithRuleElementWordTitle;
        if (!inputTextWithRuleElementWordTitle) {
            let inputTextElement = new InputTextElement(null);
            let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
            inputTextWithRuleElementWordTitle = new InputTextWithRuleElementWordTitle(inputTextWithRuleElement);
            inputTextWithRuleElementWordTitle.setSelectElementLangsIn(selectWithRuleElementLangsIn);
        }

        this.#inputTextWithRuleElementWordTitle = inputTextWithRuleElementWordTitle;
        this.#selectWithRuleElementLangsIn = selectWithRuleElementLangsIn;
    }


    async prepare() {
        await super.prepare();

        let inputTextWithRuleElementWordTitle = this.#inputTextWithRuleElementWordTitle;
        if (inputTextWithRuleElementWordTitle) {
            if (!inputTextWithRuleElementWordTitle.getIsPrepared()) {
                inputTextWithRuleElementWordTitle.prepare();
            }
        }

        let selectWithRuleElementLangsIn = this.#selectWithRuleElementLangsIn;
        if (selectWithRuleElementLangsIn) {
            if (!selectWithRuleElementLangsIn.getIsPrepared()) {
                selectWithRuleElementLangsIn.prepare();
                await selectWithRuleElementLangsIn.fill();
            }
        }
    }


    async tryToCreateContent() {
        let div = document.createElement("div");
        div.style.display = "grid";
        div.style.grid = "1fr / 1fr 1fr";
        div.style.gap = "10px";

        let inputTextWithRuleElementWordTitle = this.#inputTextWithRuleElementWordTitle;
        if (inputTextWithRuleElementWordTitle) {
            let divItem = document.createElement("div");
            divItem.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_ROW_DATA_ITEM_CLASS_ID);

            let labelRequiredElement = new LabelRequiredElement(null, null);
            labelRequiredElement.changeText("Название");
            let label = labelRequiredElement.getLabel();
            if (label) {
                divItem.appendChild(label);
            }

            let inputText = inputTextWithRuleElementWordTitle.getInputText();
            if (inputText) {
                divItem.appendChild(inputText);
            }

            div.appendChild(divItem);
        }

        let selectWithRuleElementLangsIn = this.#selectWithRuleElementLangsIn;
        if (selectWithRuleElementLangsIn) {
            let divItem = document.createElement("div");
            divItem.classList.add(_CSS_DYNAMIC_FORM_ELEMENT.DIV_DYNAMIC_FORM_ELEMENT_ROW_DATA_ITEM_CLASS_ID);

            let labelRequiredElement = new LabelRequiredElement(null, null);
            labelRequiredElement.changeText("Язык");
            let label = labelRequiredElement.getLabel();
            if (label) {
                divItem.appendChild(label);
            }

            let divContainer = selectWithRuleElementLangsIn.getDivContainer();
            if (divContainer) {
                divItem.appendChild(divContainer);
            }

            div.appendChild(divItem);
        }

        return div;
    }


    changeDisabledStatusToRowDataElements(isDisabled) {
        super.changeDisabledStatusToRowDataElements(isDisabled);

        let inputTextWithRuleElementWordTitle = this.#inputTextWithRuleElementWordTitle;
        if (inputTextWithRuleElementWordTitle) {
            inputTextWithRuleElementWordTitle.changeDisabledStatus(isDisabled);
        }

        let selectWithRuleElementLangsIn = this.#selectWithRuleElementLangsIn;
        if (selectWithRuleElementLangsIn) {
            selectWithRuleElementLangsIn.changeDisabledStatus(isDisabled);
        }
    }
}