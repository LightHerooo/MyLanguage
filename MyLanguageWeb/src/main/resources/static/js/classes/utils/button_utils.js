import {
    HtmlElementUtils
} from "./html_element_utils.js";

const _HTML_ELEMENT_UTILS = new HtmlElementUtils();

export class ButtonUtils {
    addHotkey(btnElement, hotkey, hotkeyFunction, doNeedToAddHotkeyInButtonTextContent) {
        if (doNeedToAddHotkeyInButtonTextContent === true) {
            btnElement.textContent += ` [${hotkey}]`;
        }

        _HTML_ELEMENT_UTILS.addHotkey(btnElement, hotkey, hotkeyFunction);
    }
}