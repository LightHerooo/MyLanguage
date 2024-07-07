import {
    DynamicFormRowAbstractElement

} from "../../../abstracts/dynamic_form/dynamic_form_row_abstract_element.js";

import {
    DynamicFormRowDataElementCustomerCollectionAdd
} from "./dynamic_form_row_data_element_customer_collection_add.js";

export class DynamicFormRowElementCustomerCollectionAdd extends DynamicFormRowAbstractElement {

    constructor(div) {
        super(div);
    }

    createDynamicFormRowDataElementObject() {
        return new DynamicFormRowDataElementCustomerCollectionAdd(null);
    }
}