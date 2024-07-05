import {
    CustomTimer
} from "../../../timer/custom_timer.js";

import {
    DivAbstractElement
} from "./div_abstract_element.js";

import {
    CssDivElement
} from "../../../css/div/css_div_element.js";

import {
    SpanLoadingElement
} from "../../span/elements/span_loading_element.js";

const _CSS_DIV_ELEMENT = new CssDivElement();

export class DivWithTimerAbstractElement extends DivAbstractElement {
    #timeout = 1000;

    #customTimer = new CustomTimer();

    constructor(div) {
        super(div);
        if (this.constructor === DivWithTimerAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    setTimeout(timeout) {
        this.#timeout = timeout;
    }

    getFindStatus() {
        let status = false;
        let customTimer = this.#customTimer;
        if (customTimer) {
            status = customTimer.getIsActive();
        }

        return status;
    }


    async prepare() {
        await super.prepare();

        // Подготавливаем таймер ---
        let customTimer = this.#customTimer;
        if (customTimer) {
            let self = this;
            customTimer.setHandler(async function() {
                await self.fill();
            });
            customTimer.setTimeout(this.#timeout);
        }
        //---
    }


    startToFill() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.stopToFill();

            this.showLoading();

            let customTimer = this.#customTimer;
            if (customTimer) {
                customTimer.start();
            }
        } else {
            throw new Error("Object \'DivWithTimerAbstractElement\' is not prepared");
        }
    }
    
    stopToFill() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let customTimer = this.#customTimer;
            if (customTimer) {
                customTimer.stop();
            }
        } else {
            throw new Error("Object \'DivWithTimerAbstractElement\' is not prepared");
        }
    }


    showLoading() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divContentCenter.appendChild(new SpanLoadingElement(null).getSpan());

            this.clear();

            let div = this.getDiv();
            if (div) {
                div.appendChild(divContentCenter);
            }
        } else {
            throw new Error("Object \'DivWithTimerAbstractElement\' is not prepared");
        }
    }


    async fill() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let content = await this.tryToCreateContent();

            if (content) {
                if (this.getFindStatus()) {
                    this.clear();
                }

                let div = this.getDiv();
                if (div && this.getFindStatus()) {
                    div.appendChild(content);
                }
            }
        } else {
            throw new Error("Object \'DivWithTimerAbstractElement\' is not prepared");
        }
    }
}