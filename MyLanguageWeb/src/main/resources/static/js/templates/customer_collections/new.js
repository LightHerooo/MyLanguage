import {
    DynamicFormElementNewCustomerCollections
} from "../../classes/html/form/entity/customer_collection/new/dynamic_form_element_new_customer_collections.js";

// Динамическая форма ---
let _dynamicFormElementNewCustomerCollections;
//---

window.onload = async function () {
    // Динамическая форма ---
    await prepareDynamicFormElementNewCustomerCollections();
    //---

    if (_dynamicFormElementNewCustomerCollections) {
        _dynamicFormElementNewCustomerCollections.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

// Динамическая форма ---
async function prepareDynamicFormElementNewCustomerCollections() {
    let form = document.getElementById("form_new_customer_collections");
    let divRowsContainer = document.getElementById("div_rows_container_new_customer_collections");
    let divButtonAddRowContainer = document.getElementById("div_button_add_row_container_new_customer_collections");
    let divMessageContainer = document.getElementById("div_message_container_new_customer_collections");
    let buttonSubmit = document.getElementById("button_submit_new_customer_collections");
    if (form && divRowsContainer && divButtonAddRowContainer && divMessageContainer && buttonSubmit) {
        _dynamicFormElementNewCustomerCollections = new DynamicFormElementNewCustomerCollections(
            form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit);
        _dynamicFormElementNewCustomerCollections.setMinNumberOfRows(1);
        _dynamicFormElementNewCustomerCollections.setMaxNumberOfRows(5);

        await _dynamicFormElementNewCustomerCollections.prepare();
    }
}
//---
