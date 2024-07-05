import {
    ButtonWithTextElement
} from "./button_with_text_element.js";

import {
    CustomTimerTicker
} from "../../../timer/ticker/custom_timer_ticker.js";

import {
    ButtonElementTypes
} from "../button_element_types.js";

import {
    CustomTimerTickerTypes
} from "../../../timer/ticker/custom_timer_ticker_types.js";

const _BUTTON_ELEMENT_TYPES = new ButtonElementTypes();
const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();

export class ButtonWithTextElementDoubleClick extends ButtonWithTextElement {
    #afterDoubleClickFunction;

    #customTimerTicker = new CustomTimerTicker();
    #changeButtonTextFunction;
    #firstClickFunction;

    #isPrepared = false;

    #buttonClassNameBeforeFirstClick;
    #buttonTextBeforeFirstClick;

    constructor(buttonWithTextElementObj) {
        super(buttonWithTextElementObj.getButton());

        this.#tryToSetDefaultValues();
    }

    setAfterDoubleClickFunction(afterDoubleClickFunction) {
        this.#afterDoubleClickFunction = afterDoubleClickFunction;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        // Функция изменения текста кнопки в зависимости от прошедшего времени таймера ---
        let changeButtonTextFunction = this.#changeButtonTextFunction;
        if (!changeButtonTextFunction) {
            let self = this;
            changeButtonTextFunction = function() {
                let button = self.getButton();
                if (button) {
                    let buttonTextContent = self.#buttonTextBeforeFirstClick;

                    let extraMessage = "Нажмите ещё раз, чтобы подтвердить действие";
                    let customTimerTicker = self.#customTimerTicker;
                    if (customTimerTicker) {
                        let seconds = customTimerTicker.getCurrentMilliseconds() / 1000n;
                        extraMessage = `${extraMessage}, ${seconds}s`;
                    }

                    self.changeText(`${buttonTextContent} (${extraMessage})`);
                }
            }
        }
        //---

        // Функция первого нажатия (запуск таймера, изменение стилей, ожидание второго нажатия) ---
        let firstClickFunction = this.#firstClickFunction;
        if (!firstClickFunction) {
            let self = this;
            firstClickFunction = async function() {
                // Сохраняем стили, чтобы вернуть их в случае неудачи ---
                self.#saveStylesBeforeFirstClick();
                //---

                let button = self.getButton();
                let customTimerTicker = self.#customTimerTicker;
                if (button && customTimerTicker) {
                    customTimerTicker.start();

                    // Меняем стиль кнопки ---
                    self.changeButtonStyle(_BUTTON_ELEMENT_TYPES.YELLOW);
                    //---

                    // Меняем текст кнопки ---
                    let changeButtonTextFunction = self.#changeButtonTextFunction;
                    if (changeButtonTextFunction) {
                        await changeButtonTextFunction();
                    }
                    //---

                    // Функция второго нажатия (остановка таймера, выполнение переданной функции) ---
                    button.onclick = async function() {
                        self.changeDisabledStatus(true);
                        customTimerTicker.stop();

                        let afterDoubleClickFunction = self.#afterDoubleClickFunction;
                        if (afterDoubleClickFunction) {
                            await afterDoubleClickFunction();
                        }
                    };
                    //---
                }
            }
        }

        this.#changeButtonTextFunction = changeButtonTextFunction;
        this.#firstClickFunction = firstClickFunction;
    }

    #saveStylesBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            this.#buttonClassNameBeforeFirstClick = button.className;
            this.#buttonTextBeforeFirstClick = button.textContent;
        }
    }

    #returnStylesBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            let className = this.#buttonClassNameBeforeFirstClick;
            if (className) {
                button.className = className;
            }

            let text = this.#buttonTextBeforeFirstClick;
            if (text) {
                button.textContent = text;
            }
        }
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            // Подготавливаем таймер ---
            let customTimerTicker = this.#customTimerTicker;
            if (customTimerTicker) {
                let self = this;
                customTimerTicker.setTimeout(100);
                customTimerTicker.setStartMilliseconds(5000);
                customTimerTicker.setCustomTimerTickerType(_CUSTOM_TIMER_TICKER_TYPES.BACKWARD);
                customTimerTicker.setHandler(async function () {
                    if (customTimerTicker.getCurrentMilliseconds() <= 0n) {
                        customTimerTicker.stop(false);

                        // Возвращаем стили до первого нажатия ---
                        self.#returnStylesBeforeFirstClick();
                        //---

                        // Вешаем событие первого нажатия ---
                        let button = self.getButton();
                        let firstClickFunction = self.#firstClickFunction;
                        if (button && firstClickFunction) {
                            button.onclick = firstClickFunction;
                        }
                        //---
                    } else {
                        let changeButtonTextFunction = self.#changeButtonTextFunction;
                        if (changeButtonTextFunction) {
                            await changeButtonTextFunction();
                        }
                    }
                });
            }
            //---

            // Вешаем событие первого нажатия ---
            let button = this.getButton();
            let firstClickFunction = this.#firstClickFunction;
            if (button && firstClickFunction) {
                button.onclick = firstClickFunction;
            }
            //---

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'ButtonWithTextElementDoubleClick\' has already been prepared");
        }
    }

    refresh() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.changeDisabledStatus(true);

            // Возвращаем стили до первого нажатия ---
            this.#returnStylesBeforeFirstClick();
            //---

            // Вешаем событие первого нажатия ---
            let button = this.getButton();
            let firstClickFunction = this.#firstClickFunction;
            if (button && firstClickFunction) {
                button.onclick = firstClickFunction;
            }
            //---

            this.changeDisabledStatus(false);
        } else {
            throw new Error("Object \'ButtonWithTextElementDoubleClick\' is not prepared");
        }
    }

    turnOff(isDisabled) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.changeDisabledStatus(isDisabled);

            // Возвращаем стили до первого нажатия (если необходимо) ---
            this.#returnStylesBeforeFirstClick();
            //---

            let button = this.getButton();
            if (button) {
                button.onclick = null;
            }
        } else {
            throw new Error("Object \'ButtonWithTextElementDoubleClick\' is not prepared");
        }
    }
}