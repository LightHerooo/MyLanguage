import {
    ButtonWithImgElement
} from "../with_img/button_with_img_element.js";

import {
    ButtonWithImgElementTypes
} from "../with_img/button_with_img_element_types.js";

import {
    EventNames
} from "../../event_names.js";

const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _EVENT_NAMES = new EventNames();

export class ButtonElementRefresh extends ButtonWithImgElement {
    #beforeRefreshFunction;
    #refreshFunction;
    #afterRefreshFunction;

    #isPrepared = false;

    constructor(buttonWithImgElementObj) {
        super(buttonWithImgElementObj.getButton(), buttonWithImgElementObj.getImg());
    }


    setBeforeRefreshFunction(beforeRefreshFunction) {
        this.#beforeRefreshFunction = beforeRefreshFunction;
    }

    setRefreshFunction(refreshFunction) {
        this.#refreshFunction = refreshFunction;
    }

    setAfterRefreshFunction(afterRefreshFunction) {
        this.#afterRefreshFunction = afterRefreshFunction;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            this.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.REFRESH);

            let button = this.getButton();
            if (button) {
                let self = this;
                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, async function() {
                    self.changeDisabledStatus(true);

                    let beforeRefreshFunction = self.#beforeRefreshFunction;
                    if (beforeRefreshFunction) {
                        await beforeRefreshFunction();
                    }

                    let refreshFunction = self.#refreshFunction;
                    if (refreshFunction) {
                        await refreshFunction();
                    }

                    let afterRefreshFunction = self.#afterRefreshFunction;
                    if (afterRefreshFunction) {
                        await afterRefreshFunction();
                    }

                    self.changeDisabledStatus(false);
                });
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'ButtonElementRefresh\' has already been prepared");
        }
    }
}