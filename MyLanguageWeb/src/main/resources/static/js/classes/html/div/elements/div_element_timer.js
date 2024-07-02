import {
    DivAbstractElement
} from "../abstracts/div_abstract_element.js";

import {
    CssDivElement
} from "../../../css/div/css_div_element.js";

import {
    CssRoot
} from "../../../css/css_root.js";

import {
    CustomTimerTicker
} from "../../../timer/ticker/custom_timer_ticker.js";

import {
    TimeParts
} from "../../time_parts.js";

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();

export class DivElementTimer extends DivAbstractElement {
    #rootFontSize;

    #doNeedHours = true;
    #doNeedMinutes = true;
    #doNeedSeconds = true;
    #doNeedMilliseconds = false;
    #customTimerTicker = new CustomTimerTicker();

    #spanTimer;

    constructor(div, rootFontSize) {
        super(div);
        this.#rootFontSize = rootFontSize;

        this.#tryToSetDefaultValues();
    }

    getRootFontSize() {
        return this.#rootFontSize;
    }

    getCustomTimerTickerType() {
        let value;

        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            value = customTimerTicker.getCustomTimerTickerType();
        }

        return value;
    }

    setCustomTimerTickerType(customTimerTickerType) {
        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            customTimerTicker.setCustomTimerTickerType(customTimerTickerType)
        }
    }

    setDoNeedHours(doNeedHours) {
        this.#doNeedHours = doNeedHours;
    }

    setDoNeedMinutes(doNeedMinutes) {
        this.#doNeedMinutes = doNeedMinutes;
    }

    setDoNeedSeconds(doNeedSeconds) {
        this.#doNeedSeconds = doNeedSeconds;
    }

    setDoNeedMilliseconds(doNeedMilliseconds) {
        this.#doNeedMilliseconds = doNeedMilliseconds;
    }

    getCustomTimerTicker() {
        return this.#customTimerTicker;
    }

    getCurrentMilliseconds() {
        let value;
        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            value = customTimerTicker.getCurrentMilliseconds();
        }

        return value;
    }


    #tryToSetDefaultValues() {
        let rootFontSize = this.#rootFontSize;
        if (!rootFontSize) {
            rootFontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
        }

        let spanTimer = this.#spanTimer;
        if (!spanTimer) {
            spanTimer = document.createElement("span");
            spanTimer.style.fontSize = rootFontSize;
            spanTimer.style.fontWeight = "bold";
        }

        this.#rootFontSize = rootFontSize;
        this.#spanTimer = spanTimer;
    }

    #showCurrentTime() {
        let customTimerTicker = this.#customTimerTicker;
        let spanTimer = this.#spanTimer;
        if (customTimerTicker && spanTimer) {
            spanTimer.textContent = new TimeParts(customTimerTicker.getCurrentMilliseconds())
                .getTimeStr(this.#doNeedHours, this.#doNeedMinutes, this.#doNeedSeconds, this.#doNeedMilliseconds);
        }
    }


    changeStartMilliseconds(milliseconds) {
        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            customTimerTicker.setStartMilliseconds(milliseconds);
            this.#showCurrentTime();
        }
    }

    start() {
        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            customTimerTicker.start();
        }
    }

    stop(doNeedToSaveMilliseconds) {
        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            customTimerTicker.stop(doNeedToSaveMilliseconds);
        }
    }


    async prepare() {
        await super.prepare();

        let customTimerTicker = this.#customTimerTicker;
        if (customTimerTicker) {
            customTimerTicker.setTimeout(100);

            let self = this;
            customTimerTicker.setHandler(function() {
                self.#showCurrentTime();
            })
        }
    }

    async tryToCreateContent() {
        let div = document.createElement("div");
        div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

        let spanTimer = this.#spanTimer;
        if (spanTimer) {
            div.appendChild(spanTimer);
        }

        // Отображаем текущее время ---
        this.#showCurrentTime();
        //---

        return div;
    }
}