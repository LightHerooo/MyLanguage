import {
    SelectAbstractElement
} from "../../abstracts/select_abstract_element.js";

import {
    SelectElementBooleanUtils
} from "./select_element_boolean_utils.js";

const _SELECT_ELEMENT_BOOLEAN_UTILS = new SelectElementBooleanUtils();

export class SelectElementBoolean extends SelectAbstractElement {
    constructor(select, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
    }

    getSelectedValue() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.getSelectedValue(this);
    }

    changeSelectedOptionByValue(value, doNeedToCallChangeEvent) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            _SELECT_ELEMENT_BOOLEAN_UTILS.changeSelectedOptionByValue(this, value, doNeedToCallChangeEvent);
        } else {
            throw new Error("Object \'SelectElementBoolean\' is not prepared");
        }
    }


    async createFirstOption() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.createFirstOption();
    }

    async createOptionsArr() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.createOptionsArr();
    }
}