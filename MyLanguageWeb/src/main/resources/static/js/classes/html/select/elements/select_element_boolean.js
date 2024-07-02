import {
    CssRoot
} from "../../../css/css_root.js";

import {
    SelectAbstractElement
} from "../abstracts/select_abstract_element.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_ROOT = new CssRoot();

const _EVENT_NAMES = new EventNames();

export class SelectElementBoolean extends SelectAbstractElement {
    constructor(select, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
    }

    getSelectedValue() {
        let value;

        let select = this.getSelect();
        if (select) {
            if (select.value === "1") {
                value = true;
            } else if (select.value === "0") {
                value = false;
            }
        }

        return value;
    }

    changeSelectedOptionByValue(value, doNeedToCallChangeEvent) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let select = this.getSelect();
            if (select && value !== null && value !== undefined) {
                let options = select.options;
                if (options) {
                    let valueStr = value
                        ? "1"
                        : "0";

                    for (let i = 0; i < options.length; i++) {
                        if (String(options[i].value) === valueStr) {
                            select.selectedIndex = i;
                            break;
                        }
                    }

                    if (doNeedToCallChangeEvent) {
                        this.callEvent(_EVENT_NAMES.SELECT.CHANGE);
                    }
                }
            }
        } else {
            throw new Error("Object \'SelectElementBoolean\' is not prepared.");
        }
    }


    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Не важно";

        return option;
    }

    async createOptionsArr() {
        let optionsArr = [];

        let option = document.createElement("option");
        option.style.color = _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID;
        option.value = "1";
        option.textContent = "Да";
        optionsArr.push(option);

        option = document.createElement("option");
        option.style.color = _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
        option.value = "0";
        option.textContent = "Нет";
        optionsArr.push(option);

        return optionsArr;
    }
}