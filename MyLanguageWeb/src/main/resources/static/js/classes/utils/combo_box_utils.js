import {
    CssRoot
} from "../css/css_root.js";

const _CSS_ROOT = new CssRoot();

export class ComboBoxUtils {
    GET_SELECTED_ITEM = new SelectedItemFinder();
    GET_SELECTED_ITEM_VALUE = new SelectedItemValueFinder();
    CHANGE_SELECTED_ITEM = new SelectedItemChanger();

    callChangeEvent(comboBoxElement) {
        let generalFunctions = new GeneralFunctions();
        generalFunctions.callChangeEvent(comboBoxElement);
    }

    prepareCbBoolean(cbBoolean) {
        if (cbBoolean) {
            cbBoolean.replaceChildren();

            let trueOption = document.createElement("option");
            trueOption.style.color = _CSS_ROOT.ACCEPT_FIRST_COLOR;
            trueOption.textContent = "Да";
            cbBoolean.appendChild(trueOption);

            let falseOption = document.createElement("option");
            falseOption.style.color = _CSS_ROOT.DENY_FIRST_COLOR;
            falseOption.textContent = "Нет";
            cbBoolean.appendChild(falseOption);

            let thisClass = this;
            cbBoolean.addEventListener("change", async function() {
                let selectedOption = thisClass.GET_SELECTED_ITEM.byComboBox(this);
                this.style.backgroundColor = selectedOption.style.color;
            });
        }
    }
}

class GeneralFunctions {
    callChangeEvent(comboBoxElement) {
        let event = new Event('change');
        comboBoxElement.dispatchEvent(event);
    }
}

class SelectedItemFinder {
    byComboBoxId(comboBoxId) {
        let comboBox = document.getElementById(comboBoxId);
        return this.byComboBox(comboBox);
    }

    byComboBox(comboBoxElement) {
        let selectedItem;
        if (comboBoxElement) {
            if (comboBoxElement.selectedIndex > -1) {
                selectedItem = comboBoxElement.options[comboBoxElement.selectedIndex];
            }
        }

        return selectedItem;
    }
}

class SelectedItemValueFinder {
    byComboBoxId(comboBoxId) {
        let comboBox = document.getElementById(comboBoxId);
        return this.byComboBox(comboBox);
    }

    byComboBox(comboBoxElement) {
        let selectedItemFinder = new SelectedItemFinder();

        let selectedItemId;
        let selectedItem = selectedItemFinder.byComboBox(comboBoxElement);
        if (selectedItem) {
            selectedItemId = selectedItem.value;
        }

        return selectedItemId;
    }
}

class SelectedItemChanger {
    byComboBoxIdAndItemValue(comboBoxId, itemValue, doNeedToCallChangeEvent) {
        let comboBox = document.getElementById(comboBoxId);
        this.byComboBoxAndItemValue(comboBox, itemValue, doNeedToCallChangeEvent);
    }

    byComboBoxAndItemValue(comboBoxElement, itemValue, doNeedToCallChangeEvent) {
        if (comboBoxElement) {
            for (let i = 0; i < comboBoxElement.options.length; i++) {
                if (String(comboBoxElement.options[i].value) === String(itemValue)) {
                    comboBoxElement.selectedIndex = i;
                    break;
                }
            }

            if (doNeedToCallChangeEvent === true) {
                let generalFunctions = new GeneralFunctions();
                generalFunctions.callChangeEvent(comboBoxElement);
            }
        }
    }

    byComboBoxIdAndItemIndex(comboBoxId, itemIndex, doNeedToCallChangeEvent) {
        let comboBox = document.getElementById(comboBoxId);
        this.byComboBoxAndItemIndex(comboBox, itemIndex, doNeedToCallChangeEvent);
    }

    byComboBoxAndItemIndex(comboBoxElement, itemIndex, doNeedToCallChangeEvent) {
        if (comboBoxElement) {
            comboBoxElement.selectedIndex = itemIndex;

            if (doNeedToCallChangeEvent === true) {
                let generalFunctions = new GeneralFunctions();
                generalFunctions.callChangeEvent(comboBoxElement);
            }
        }
    }
}
