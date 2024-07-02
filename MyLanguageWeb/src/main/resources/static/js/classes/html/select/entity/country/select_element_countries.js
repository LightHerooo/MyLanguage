import {
    SelectElementCountriesUtils
} from "./select_element_countries_utils.js";

import {
    SelectWithFlagAbstractElement
} from "../../with_flag/abstracts/select_with_flag_abstract_element.js";

const _SELECT_ELEMENT_COUNTRIES_UTILS = new SelectElementCountriesUtils();

export class SelectElementCountries extends SelectWithFlagAbstractElement {
    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Все страны";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_ELEMENT_COUNTRIES_UTILS.createOptionsArr();
    }

    async changeFlag() {
        await _SELECT_ELEMENT_COUNTRIES_UTILS.changeFlag(this);
    }
}