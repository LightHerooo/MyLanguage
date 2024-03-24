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

    callClickEvent(btnElement) {
        let event = new Event('click');
        btnElement.dispatchEvent(event);
    }

    prepareBtnRefreshWithPromise(btnRefresh,
                                 beforeRefreshFunction,
                                 refreshFunction,
                                 afterRefreshFunction,
                                 customTimerObj) {
        if (btnRefresh && customTimerObj) {
            btnRefresh.addEventListener("click", async function() {
                if (beforeRefreshFunction) {
                    await beforeRefreshFunction();
                }

                let refreshPromise = new Promise(resolve => {
                    customTimerObj.stop();

                    customTimerObj.setTimeout(500);
                    customTimerObj.setHandler(async function() {
                        if (refreshFunction) {
                            await refreshFunction();
                        }

                        resolve();
                    })

                    customTimerObj.start();
                });
                await refreshPromise;

                if (afterRefreshFunction) {
                    await afterRefreshFunction();
                }
            });
        }
    }
}