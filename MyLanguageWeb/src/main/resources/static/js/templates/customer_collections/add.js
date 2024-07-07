import {
    DynamicFormElementCustomerCollectionsAdd
} from "../../classes/html/form/entity/customer_collection/add/dynamic_form_element_customer_collections_add.js";

// Динамическая форма ---
let _dynamicFormElementCustomerCollectionsAdd;
//---

window.onload = async function () {
    // Динамическая форма ---
    await prepareDynamicFormElementCustomerCollectionsAdd();
    //---

    if (_dynamicFormElementCustomerCollectionsAdd) {
        _dynamicFormElementCustomerCollectionsAdd.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

// Динамическая форма ---
async function prepareDynamicFormElementCustomerCollectionsAdd() {
    let form = document.getElementById("form_customer_collections_add");
    let divRowsContainer = document.getElementById("div_rows_container_customer_collections_add");
    let divButtonAddRowContainer = document.getElementById("div_button_add_row_container_customer_collections_add");
    let divMessageContainer = document.getElementById("div_message_container_customer_collections_add");
    let buttonSubmit = document.getElementById("button_submit_customer_collections_add");
    if (form && divRowsContainer && divButtonAddRowContainer && divMessageContainer && buttonSubmit) {
        _dynamicFormElementCustomerCollectionsAdd = new DynamicFormElementCustomerCollectionsAdd(
            form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit);
        _dynamicFormElementCustomerCollectionsAdd.setMinNumberOfRows(1);
        _dynamicFormElementCustomerCollectionsAdd.setMaxNumberOfRows(5);

        await _dynamicFormElementCustomerCollectionsAdd.prepare();
    }
}
//---
