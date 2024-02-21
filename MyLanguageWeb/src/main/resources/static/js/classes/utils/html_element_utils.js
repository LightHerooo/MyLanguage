export class HtmlElementUtils {
    addHotkey(htmlElement, hotkey, hotkeyFunction) {
        htmlElement.addEventListener("keydown", function (event) {
            if (event.key === hotkey) {
                if (event.repeat === true) return;
                hotkeyFunction();
            }
        });
    }
}