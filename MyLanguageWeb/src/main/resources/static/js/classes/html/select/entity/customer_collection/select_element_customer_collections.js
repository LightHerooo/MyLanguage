import {
    SelectElementCustomerCollectionsUtils
} from "./select_element_customer_collections_utils.js";

import {
    SelectWithFlagAbstractElement
} from "../../abstracts/with_flag/select_with_flag_abstract_element.js";

const _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS =
    new SelectElementCustomerCollectionsUtils();

export class SelectElementCustomerCollections extends SelectWithFlagAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
    }

    getSelectedValue() {
        return _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.getSelectedValue(this);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Нет коллекции";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.createOptionsArr();
    }

    async changeFlag() {
        await _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.changeFlag(this);
    }
}