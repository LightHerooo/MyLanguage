import {
    ButtonWithImgElement
} from "./button_with_img_element.js";

import {
    CustomTimerTickerTypes
} from "../../../timer/ticker/custom_timer_ticker_types.js";

import {
    ButtonWithImgElementTypes
} from "./button_with_img_element_types.js";

import {
    CustomTimerTicker
} from "../../../timer/ticker/custom_timer_ticker.js";

const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();

export class ButtonWithImgElementDoubleClick extends ButtonWithImgElement {
    #afterDoubleClickFunction;

    #customTimerTicker = new CustomTimerTicker();
    #firstClickFunction;

    #isPrepared = false;

    #buttonClassNameBeforeFirstClick;
    #buttonTitleBeforeFirstClick;
    #imgSrcBeforeFirstClick;

    constructor(buttonWithImgElementObj) {
        super(buttonWithImgElementObj.getButton(), buttonWithImgElementObj.getImg());

        this.#tryToSetDefaultValues();
    }

    setAfterDoubleClickFunction(afterDoubleClickFunction) {
        this.#afterDoubleClickFunction = afterDoubleClickFunction;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        // Функция первого нажатия (запуск таймера, изменение стилей, ожидание второго нажатия) ---
        let firstClickFunction = this.#firstClickFunction;
        if (!firstClickFunction) {
            let self = this;
            firstClickFunction = async function() {
                // Сохраняем стили, чтобы вернуть их в случае неудачи ---
                self.#saveSettingsBeforeFirstClick();
                //---

                let button = self.getButton();
                let customTimerTicker = self.#customTimerTicker;
                if (button && customTimerTicker) {
                    customTimerTicker.start();

                    // Меняем стиль кнопки + title ---
                    self.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.QUESTION);
                    self.changeTitle(`${button.title} (Нажмите ещё раз, чтобы подтвердить действие)`);
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
        //---

        this.#firstClickFunction = firstClickFunction;
    }

    #saveSettingsBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            this.#buttonClassNameBeforeFirstClick = button.className;
            this.#buttonTitleBeforeFirstClick = button.title;
        }

        let img = this.getImg();
        if (img) {
            this.#imgSrcBeforeFirstClick = img.src;
        }
    }

    #returnSettingsBeforeFirstClick() {
        let button = this.getButton();
        if (button) {
            let className = this.#buttonClassNameBeforeFirstClick;
            if (className) {
                button.className = className;
            }

            let title = this.#buttonTitleBeforeFirstClick;
            if (title) {
                button.title = title;
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
                customTimerTicker.setHandler(async function() {
                    let customTimerTicker = self.#customTimerTicker;
                    if (customTimerTicker) {
                        if (customTimerTicker.getCurrentMilliseconds() <= 0n) {
                            customTimerTicker.stop(false);

                            // Возвращаем стили до первого нажатия ---
                            self.#returnSettingsBeforeFirstClick();
                            //---

                            // Вешаем событие первого нажатия ---
                            let button = self.getButton();
                            let firstClickFunction = self.#firstClickFunction;
                            if (button && firstClickFunction) {
                                button.onclick = firstClickFunction;
                            }
                            //---
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
            throw new Error("Object \'ButtonWithImgElementDoubleClick\' has already been prepared.");
        }
    }


    refresh() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.changeDisabledStatus(true);

            // Возвращаем стили до первого нажатия ---
            this.#returnSettingsBeforeFirstClick();
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
            throw new Error("Object \'ButtonWithImgElementDoubleClick\' is not prepared.");
        }
    }

    turnOff() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.changeDisabledStatus(true);

            let button = this.getButton();
            if (button) {
                button.onclick = null;
            }
        } else {
            throw new Error("Object \'ButtonWithImgElementDoubleClick\' is not prepared.");
        }
    }
}