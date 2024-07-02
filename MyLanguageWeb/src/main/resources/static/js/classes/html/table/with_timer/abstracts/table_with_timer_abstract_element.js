import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    TableAbstractElement
} from "../../abstracts/table_abstract_element.js";

import {
    CustomTimer
} from "../../../../timer/custom_timer.js";

import {
    SpanLoadingElement
} from "../../../span/elements/span_loading_element.js";

const _CSS_DIV_ELEMENT = new CssDivElement();

const _TABLE_UTILS = new TableUtils();

export class TableWithTimerAbstractElement extends TableAbstractElement {
    #timeout = 1000;

    #customTimer = new CustomTimer();

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
        if (this.constructor === TableWithTimerAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    getTimeout() {
        return this.#timeout;
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
            customTimer.setHandler(async function () {
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
            throw new Error("Object \'TableWithTimerAbstractElement\' is not prepared.");
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
            throw new Error("Object \'TableWithTimerAbstractElement\' is not prepared.");
        }
    }


    showLoading() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.stopToFill();

            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divContentCenter.appendChild(new SpanLoadingElement(null).getSpan());

            let tr = _TABLE_UTILS.createTrWithAnyElement(
                divContentCenter, this.getNumberOfColumns(), false);
            if (tr) {
                this.clear();
                this.addTr(tr);
            }
        } else {
            throw new Error("Object \'TableWithTimerAbstractElement\' is not prepared.");
        }
    }


    async fill() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            // Очищаем данные для генерации строк ---
            if (this.getFindStatus()) {
                this.setCurrentRowNumber(0n);
                this.setValueForNextPage(null);
            }
            //---

            let trsArr = await this.tryToCreateTrsArr(true);
            if (trsArr) {
                if (this.getFindStatus()) {
                    this.clear();
                }

                for (let tr of trsArr) {
                    if (!this.getFindStatus()) break;
                    this.addTr(tr);
                }
            }
        } else {
            throw new Error("Object \'TableWithTimerAbstractElement\' is not prepared.");
        }
    }

    createTrShowMore(message) {
        let self = this;
        return _TABLE_UTILS.createTrShowMore(this.getNumberOfColumns(), message, async function() {
            let trsArr = await self.tryToCreateTrsArr(false);
            if (trsArr) {
                for (let tr of trsArr) {
                    if (!self.getFindStatus()) break;
                    self.addTr(tr);
                }
            }
        });
    }
}