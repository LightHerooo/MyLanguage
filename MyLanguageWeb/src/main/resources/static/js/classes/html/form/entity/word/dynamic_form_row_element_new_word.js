import {
    DynamicFormRowAbstractElement
} from "../../abstracts/dynamic_form/dynamic_form_row_abstract_element.js";

import {
    DynamicFormRowDataElementNewWord
} from "./dynamic_form_row_data_element_new_word.js";

export class DynamicFormRowElementNewWord extends DynamicFormRowAbstractElement {

    constructor(div) {
        super(div);
    }

    createDynamicFormRowDataElementObject() {
        return new DynamicFormRowDataElementNewWord(null);
    }
}