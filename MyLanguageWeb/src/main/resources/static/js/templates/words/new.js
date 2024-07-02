import {
    DynamicFormElementNewWords
} from "../../classes/html/form/entity/word/dynamic_form_element_new_words.js";

// Динамическая форма ---
let _dynamicFormElementNewWords;
//---

window.onload = async function() {
    // Динамическая форма ---
    await prepareDynamicFormElementNewWords();
    //---

    if (_dynamicFormElementNewWords) {
        _dynamicFormElementNewWords.changeDisabledStatusToFormElements(false);
    }
}

window.onbeforeunload = async function () {

}

// Динамическая форма ---
async function prepareDynamicFormElementNewWords() {
    let form = document.getElementById("form_new_words");
    let divRowsContainer = document.getElementById("div_rows_container_new_words");
    let divButtonAddRowContainer = document.getElementById("div_button_add_row_container_new_words");
    let divMessageContainer = document.getElementById("div_message_container_new_words");
    let buttonSubmit = document.getElementById("button_submit_new_words");
    if (form && divRowsContainer && divButtonAddRowContainer && divMessageContainer && buttonSubmit) {
        _dynamicFormElementNewWords = new DynamicFormElementNewWords(
            form, divRowsContainer, divButtonAddRowContainer, divMessageContainer, buttonSubmit);
        _dynamicFormElementNewWords.setMinNumberOfRows(1);
        _dynamicFormElementNewWords.setMaxNumberOfRows(5);

        await _dynamicFormElementNewWords.prepare();
    }
}
//---