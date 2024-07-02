import {
    InputTextElement
} from "../input_text_element.js";

import {
    CustomTimer
} from "../../../../timer/custom_timer.js";

import {
    EventNames
} from "../../../event_names.js";

const _EVENT_NAMES = new EventNames();

export class InputTextElementFinder extends InputTextElement {
    #customTimer = new CustomTimer();
    #isPrepared = false;

    constructor(inputTextElementObj) {
        super(inputTextElementObj.getInputText());
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    addInputFunction(inputFunction) {
        let customTimer = this.#customTimer;
        if (customTimer && inputFunction) {
            let oldHandler = customTimer.getHandler();
            customTimer.setHandler(async function() {
                if (oldHandler) {
                    await oldHandler();
                }

                await inputFunction();
            })
        }
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let customTimer = this.#customTimer;
            if (customTimer) {
                customTimer.setTimeout(250);
            }

            let inputText = this.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, async function() {
                    let customTimer = self.#customTimer;
                    if (customTimer) {
                        customTimer.stop();
                        customTimer.start();
                    }
                });
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'InputTextElementFinder\' has already been prepared.");
        }
    }
}