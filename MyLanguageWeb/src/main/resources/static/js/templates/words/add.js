import {
    DynamicFormElementWordsAdd
} from "../../classes/html/form/entity/word/add/dynamic_form_element_words_add.js";

// Динамическая форма ---
let _dynamicFormElementWordsAdd;
//---

window.onload = async function() {
    // Динамическая форма ---
    await prepareDynamicFormElementWordsAdd();
    //---

    if (_dynamicFormElementWordsAdd) {
        _dynamicFormElementWordsAdd.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

// Динамическая форма ---
async function prepareDynamicFormElementWordsAdd() {
    let form = document.getElementById("form_words_add");
    let divRowsContainer = document.getElementById("div_rows_container_words_add");
    let divButtonAddRowContainer = document.getElementById("div_button_add_row_container_words_add");
    let divMessageContainer = document.getElementById("div_message_container_words_add");
    let buttonSubmit = document.getElementById("button_submit_words_add");
    if (form && divRowsContainer && divButtonAddRowContainer && divMessageContainer && buttonSubmit) {
        _dynamicFormElementWordsAdd = new DynamicFormElementWordsAdd(
            form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit);
        _dynamicFormElementWordsAdd.setMinNumberOfRows(1);
        _dynamicFormElementWordsAdd.setMaxNumberOfRows(5);

        await _dynamicFormElementWordsAdd.prepare();
    }
}
//---