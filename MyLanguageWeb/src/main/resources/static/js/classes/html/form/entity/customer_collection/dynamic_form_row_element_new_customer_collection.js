import {
    DynamicFormRowAbstractElement

} from "../../abstracts/dynamic_form/dynamic_form_row_abstract_element.js";

import {
    DynamicFormRowDataElementNewCustomerCollection
} from "./dynamic_form_row_data_element_new_customer_collection.js";

export class DynamicFormRowElementNewCustomerCollection extends DynamicFormRowAbstractElement {

    constructor(div) {
        super(div);
    }

    createDynamicFormRowDataElementObject() {
        return new DynamicFormRowDataElementNewCustomerCollection(null);
    }
}