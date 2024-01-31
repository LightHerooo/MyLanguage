export class ComboBoxUtils {
    GET_SELECTED_ITEM = new SelectedItemFinder();
    GET_SELECTED_ITEM_ID = new SelectedItemIdFinder();
    CHANGE_SELECTED_ITEM = new SelectedItemChanger();
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

class SelectedItemIdFinder {
    byComboBoxId(comboBoxId) {
        let comboBox = document.getElementById(comboBoxId);
        return this.byComboBox(comboBox);
    }

    byComboBox(comboBoxElement) {
        let selectedItemFinder = new SelectedItemFinder();

        let selectedItemId;
        let selectedItem = selectedItemFinder.byComboBox(comboBoxElement);
        if (selectedItem) {
            selectedItemId = selectedItem.id;
        }

        return selectedItemId;
    }
}

class SelectedItemChanger {
    byComboBoxIdAndItemId(comboBoxId, itemId, doNeedToCallChangeEvent) {
        let comboBox = document.getElementById(comboBoxId);
        this.byComboBoxAndItemId(comboBox, itemId, doNeedToCallChangeEvent);
    }

    byComboBoxAndItemId(comboBoxElement, itemId, doNeedToCallChangeEvent) {
        if (comboBoxElement) {
            for (let i = 0; i < comboBoxElement.options.length; i++) {
                if (comboBoxElement.options[i].id === itemId) {
                    comboBoxElement.selectedIndex = i;
                    break;
                }
            }

            if (doNeedToCallChangeEvent === true) {
                let event = new Event('change');
                comboBoxElement.dispatchEvent(event);
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
                let event = new Event('change');
                comboBoxElement.dispatchEvent(event);
            }
        }
    }
}
