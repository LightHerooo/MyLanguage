import {
    SelectElementLangsUtils
} from "../select_element_langs_utils.js";

import {
    SelectWithFlagAbstractElement
} from "../../../with_flag/abstracts/select_with_flag_abstract_element.js";

const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();

export class SelectElementLangsOut extends SelectWithFlagAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Все";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOut();
    }

    async changeFlag() {
        await _SELECT_ELEMENT_LANGS_UTILS.changeFlag(this);
    }
}