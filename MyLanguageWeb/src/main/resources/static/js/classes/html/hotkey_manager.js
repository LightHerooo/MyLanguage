import {
    EventNames
} from "./event_names.js";

const _EVENT_NAMES = new EventNames();

export class HotkeyManager {
    add(keyCode, actionFunction, doNeedToRemoveAfterAction) {
        let self = this;
        let hotkeyManagerAddFunction = async function(e) {
            if (e.code.toLowerCase() === keyCode.toLowerCase()) {
                if (e.repeat) return;

                if (doNeedToRemoveAfterAction) {
                    self.remove(hotkeyManagerAddFunction);
                }

                await actionFunction();
            }
        }

        document.addEventListener(_EVENT_NAMES.KEYBOARD.KEYDOWN, hotkeyManagerAddFunction);

        return hotkeyManagerAddFunction;
    }

    remove(hotkeyManagerAddFunction) {
        document.removeEventListener(_EVENT_NAMES.KEYBOARD.KEYDOWN, hotkeyManagerAddFunction);
    }
}