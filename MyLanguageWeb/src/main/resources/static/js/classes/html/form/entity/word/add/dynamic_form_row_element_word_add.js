import {
    DynamicFormRowAbstractElement
} from "../../../abstracts/dynamic_form/dynamic_form_row_abstract_element.js";

import {
    DynamicFormRowDataElementWordAdd
} from "./dynamic_form_row_data_element_word_add.js";

export class DynamicFormRowElementWordAdd extends DynamicFormRowAbstractElement {

    constructor(div) {
        super(div);
    }

    createDynamicFormRowDataElementObject() {
        return new DynamicFormRowDataElementWordAdd(null);
    }
}