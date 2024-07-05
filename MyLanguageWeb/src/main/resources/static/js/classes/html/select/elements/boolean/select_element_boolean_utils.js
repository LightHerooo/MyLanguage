import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    EventNames
} from "../../../event_names.js";

const _CSS_ROOT = new CssRoot();
const _EVENT_NAMES = new EventNames();

export class SelectElementBooleanUtils {
    createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Не важно";

        return option;
    }

    createOptionsArr() {
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

    getSelectedValue(selectElementBooleanObj) {
        let value;

        if (selectElementBooleanObj) {
            let select = selectElementBooleanObj.getSelect();
            if (select) {
                if (select.value === "1") {
                    value = true;
                } else if (select.value === "0") {
                    value = false;
                }
            }
        }

        return value;
    }

    changeSelectedOptionByValue(selectElementBooleanObj, value, doNeedToCallChangeEvent) {
        if (selectElementBooleanObj) {
            let select = selectElementBooleanObj.getSelect();
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
                        selectElementBooleanObj.callEvent(_EVENT_NAMES.SELECT.CHANGE);
                    }
                }
            }
        }
    }
}