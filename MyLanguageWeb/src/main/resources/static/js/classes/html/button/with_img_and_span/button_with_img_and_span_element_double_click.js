import {
    ButtonWithImgAndSpanElement
} from "./button_with_img_and_span_element.js";

import {
    CustomTimerTickerTypes
} from "../../../timer/ticker/custom_timer_ticker_types.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "./button_with_img_and_span_element_types.js";

import {
    CustomTimerTicker
} from "../../../timer/ticker/custom_timer_ticker.js";

const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();

export class ButtonWithImgAndSpanElementDoubleClick extends ButtonWithImgAndSpanElement {
    #afterDoubleClickFunction;

    #customTimerTicker = new CustomTimerTicker();
    #changeSpanTextFunction;
    #firstClickFunction;

    #isPrepared = false;

    #buttonClassNameBeforeFirstClick;
    #spanTextBeforeFirstClick;
    #imgSrcBeforeFirstClick;

    constructor(buttonWithImgAndSpanElementObj) {
        super(buttonWithImgAndSpanElementObj.getButton(), buttonWithImgAndSpanElementObj.getImg(), buttonWithImgAndSpanElementObj.getSpan());

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
        let changeSpanTextFunction = this.#changeSpanTextFunction;
        if (!changeSpanTextFunction) {
            let self = this;
            changeSpanTextFunction = function() {
                let span = self.getSpan();
                if (span) {
                    let spanTextContent = self.#spanTextBeforeFirstClick;

                    let extraMessage = "Нажмите ещё раз, чтобы подтвердить действие";
                    let customTimerTicker = self.#customTimerTicker;
                    if (customTimerTicker) {
                        let seconds = customTimerTicker.getCurrentMilliseconds() / 1000n;
                        extraMessage = `${extraMessage}, ${seconds}s`;
                    }

                    span.textContent = `${spanTextContent} (${extraMessage})`;
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
                    self.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.QUESTION);
                    //---

                    // Меняем текст кнопки ---
                    let changeSpanTextFunction = self.#changeSpanTextFunction;
                    if (changeSpanTextFunction) {
                        await changeSpanTextFunction();
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

        this.#changeSpanTextFunction = changeSpanTextFunction;
        this.#firstClickFunction = firstClickFunction;
    }

    #saveStylesBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            this.#buttonClassNameBeforeFirstClick = button.className;
        }

        let span = this.getSpan();
        if (span) {
            this.#spanTextBeforeFirstClick = span.textContent;
        }

        let img = this.getImg();
        if (img) {
            this.#imgSrcBeforeFirstClick = img.src;
        }
    }

    #returnStylesBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            let className = this.#buttonClassNameBeforeFirstClick;
            if (className) {
                button.className = className;
            }
        }

        let span = this.getSpan();
        if (span) {
            let text = this.#spanTextBeforeFirstClick;
            if (text) {
                span.textContent = text;
            }
        }

        let img = this.getImg();
        if (img) {
            let src = this.#imgSrcBeforeFirstClick;
            if (src) {
                img.src = src;
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
                        let changeSpanTextFunction = self.#changeSpanTextFunction;
                        if (changeSpanTextFunction) {
                            await changeSpanTextFunction();
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
            throw new Error("Object \'ButtonWithImgAndSpanElementDoubleClick\' has already been prepared");
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
            throw new Error("Object \'ButtonWithImgAndSpanElementDoubleClick\' is not prepared");
        }
    }

    turnOff(isDisabled) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.changeDisabledStatus(isDisabled);

            // Возвращаем стили до первого нажатия ---
            this.#returnStylesBeforeFirstClick();
            //---

            let button = this.getButton();
            if (button) {
                button.onclick = null;
            }
        } else {
            throw new Error("Object \'ButtonWithImgAndSpanElementDoubleClick\' is not prepared");
        }
    }
}