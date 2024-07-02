import {
    ButtonAbstractElement
} from "../abstracts/button_abstract_element.js";

export class ButtonWithTextElement extends ButtonAbstractElement {
    constructor(button) {
        super(button);
    }

    changeText(str) {
        let button = this.getButton();
        if (button) {
            button.textContent = str;
        }
    }

    addHotkey(hotkeyName, hotkeyFunction, doNeedToDeleteHotkeyAfterAction) {
        super.addHotkey(hotkeyName, hotkeyFunction, doNeedToDeleteHotkeyAfterAction);

        let button = this.getButton();
        if (button) {
            button.textContent = `${button.textContent} [${hotkeyName}]`;
        }
    }
}