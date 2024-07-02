import {
    BigIntUtils
} from "../../utils/bigint_utils.js";

import {
    CustomTimerTickerTypes
} from "./custom_timer_ticker_types.js";

const _BIGINT_UTILS = new BigIntUtils();
const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();

export class CustomTimerTicker {
    #customTimerTickerType = _CUSTOM_TIMER_TICKER_TYPES.FORWARD;

    #startMilliseconds = 0n;
    #dateOfStart;
    #millisecondsBuffer = 0n;

    #handler;
    #timeout = 1000;

    #id;
    #isActive = false;

    getCustomTimerTickerType() {
        return this.#customTimerTickerType;
    }

    setCustomTimerTickerType(customTimerTickerType) {
        this.#customTimerTickerType = customTimerTickerType;
    }

    getHandler() {
        return this.#handler;
    }

    setHandler(handler) {
        this.#handler = handler;
    }

    getTimeout() {
        return this.#timeout;
    }

    setTimeout(timeout) {
        this.#timeout = timeout;
    }

    getIsActive() {
        return this.#isActive;
    }

    setStartMilliseconds(milliseconds) {
        let isActive = this.getIsActive();
        if (!isActive) {
            let millisecondsBI = _BIGINT_UTILS.parse(milliseconds);
            if (millisecondsBI) {
                this.#startMilliseconds = millisecondsBI;
            }
        } else {
            throw new Error("Timer is active");
        }

    }

    getCurrentMilliseconds() {
        let currentMilliseconds = this.#startMilliseconds + this.#millisecondsBuffer;

        let datesMilliseconds = this.#getDatesMilliseconds();
        if (datesMilliseconds) {
            let customTimerTickerType = this.#customTimerTickerType;
            switch (customTimerTickerType) {
                case _CUSTOM_TIMER_TICKER_TYPES.FORWARD:
                    currentMilliseconds += datesMilliseconds; break;
                case _CUSTOM_TIMER_TICKER_TYPES.BACKWARD:
                    currentMilliseconds -= datesMilliseconds; break;
            }
        }

        if (currentMilliseconds <= 0n) {
            currentMilliseconds = 0n;
        }

        return currentMilliseconds;
    }


    #getDatesMilliseconds() {
        let value;

        let dateOfStart = this.#dateOfStart;
        if (dateOfStart) {
            value = _BIGINT_UTILS.parse(new Date() - dateOfStart);
        }

        return value;

    }


    addMilliseconds(milliseconds) {
        let millisecondsBI = _BIGINT_UTILS.parse(milliseconds);
        if (millisecondsBI) {
            this.#millisecondsBuffer += millisecondsBI;
        }
    }

    subtractMilliseconds(milliseconds) {
        let millisecondsBI = _BIGINT_UTILS.parse(milliseconds);
        if (millisecondsBI) {
            this.#millisecondsBuffer -= millisecondsBI;
        }
    }


    stop(doNeedToSaveMilliseconds) {
        this.#isActive = false;

        if (doNeedToSaveMilliseconds) {
            let datesMilliseconds = this.#getDatesMilliseconds();
            if (datesMilliseconds) {
                this.#millisecondsBuffer += datesMilliseconds;
            }
        } else {
            this.#millisecondsBuffer = 0n;
        }

        this.#dateOfStart = null;

        clearInterval(this.#id);
    }

    start() {
        this.stop(true);

        // Устанавливаем дату начала ---
        this.#dateOfStart = new Date();
        //---

        let self = this;
        this.#id = setInterval(async function() {
            self.#isActive = true;

            let handler = self.#handler;
            if (handler) {
                await handler();
            }
        }, this.#timeout);
    }
}