import {
    InputImgElementCustomerCollectionImage
} from "../../classes/html/input/file/entity/customer_collection/input_img_element_customer_collection_image.js";

import {
    UrlUtils
} from "../../classes/url/url_utils.js";

import {
    InputTextWithRuleElementCustomerCollectionTitleEdit
} from "../../classes/html/input/text/entity/customer_collection/title/input_text_with_rule_element_customer_collection_title_edit.js";

import {
    InputTextWithRuleElement
} from "../../classes/html/input/text/input_text_with_rule_element.js";

import {
    ButtonWithTextElementDoubleClick
} from "../../classes/html/button/with_text/button_with_text_element_double_click.js";

import {
    ButtonWithTextElement
} from "../../classes/html/button/with_text/button_with_text_element.js";

import {
    SelectWithRuleElementBoolean
} from "../../classes/html/select/elements/boolean/select_with_rule_element_boolean.js";

import {
    TextareaWithCounterElement
} from "../../classes/html/textarea/with_counter/textarea_with_counter_element.js";

import {
    TextareaElement
} from "../../classes/html/textarea/textarea_element.js";

import {
    FormElementCustomerCollectionEdit
} from "../../classes/html/form/entity/customer_collection/form_element_customer_collection_edit.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    ButtonWithImgAndSpanElement
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element.js";

import {
    ButtonWithImgAndSpanElementDoubleClick
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element_double_click.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWordsInCollectionEdit
} from "../../classes/html/table/entity/word_in_collection/table_with_timer_element_words_in_collection_edit.js";

import {
    BigIntUtils
} from "../../classes/utils/bigint_utils.js";

const _URL_UTILS = new UrlUtils();
const _BIGINT_UTILS = new BigIntUtils();

const _GENERAL_TIMEOUT = 1000;

// Элементы формы + форма "Изменение коллекции" ---
let _inputImgElementCustomerCollectionImage;
let _inputTextWithRuleElementCustomerCollectionTitleEdit;
let _selectWithRuleElementBooleanCustomerCollectionIsActive;
let _textareaElementCustomerCollectionDescription;

let _formElementCustomerCollectionEdit;
//---

// Элменты таблицы + таблица "Изменение слов в коллекции" ---
let _buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete;
let _buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete;
let _inputTextElementFinder;
let _buttonElementRefresh;

let _tableWithTimerElementWordsInCollectionEdit;
//---

let _currentCustomerCollectionId;

window.onload = async function() {
    // Пробуем получить текущий id коллекции ---
    tryToGetCurrentCustomerCollectionId();
    //---

    // Элементы формы + форма "Изменение коллекции" ---
    prepareInputImgElementCustomerCollectionImage();
    prepareInputTextWithRuleElementCustomerCollectionTitleEdit();
    await prepareSelectWithRuleElementBooleanCustomerCollectionIsActive();
    prepareTextareaWithCounterElementCustomerCollectionDescription();

    await prepareFormElementCustomerCollectionEdit();
    //---

    // Элменты таблицы + таблица "Изменение слов в коллекции" ---
    prepareButtonWithImgAndSpanElementSelectAllWordsForDelete();
    prepareButtonWithImgAndSpanElementDeselectAllWordsForDelete();
    prepareInputTextElementFinder();
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementWordsInCollectionEdit();
    //---

    // Запускаем таймеры ---
    if (_formElementCustomerCollectionEdit) {
        _formElementCustomerCollectionEdit.setTableWithTimerElementWordsInCollectionEdit(
            _tableWithTimerElementWordsInCollectionEdit);
        _formElementCustomerCollectionEdit.changeDisabledStatusToFormElements(false);
    }

    if (_tableWithTimerElementWordsInCollectionEdit) {
        _tableWithTimerElementWordsInCollectionEdit.startToFill();
        _tableWithTimerElementWordsInCollectionEdit.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

window.onbeforeunload = function () {

}

function tryToGetCurrentCustomerCollectionId() {
    let pathVariable = _URL_UTILS.getPathVariable();
    if (pathVariable) {
        _currentCustomerCollectionId = _BIGINT_UTILS.parse(pathVariable);
    }
}

// Элементы формы + форма "Изменение коллекции" ---
function prepareInputImgElementCustomerCollectionImage() {
    let divInputImgContainer = document.getElementById("div_input_img_customer_collection_image");
    let img = document.getElementById("img_customer_collection_image");
    let divInputFileContainer = document.getElementById("div_input_file_customer_collection_image");
    let labelContainer = document.getElementById("label_input_file_customer_collection_image");
    let inputFile = document.getElementById("input_file_customer_collection_image");
    let buttonDropSelectedFiles = document.getElementById("button_drop_selected_files_customer_collection_image");
    let divMessageContainer = document.getElementById("div_input_file_message_container_customer_collection_image");
    if (divInputImgContainer && img && divInputFileContainer && labelContainer && inputFile
        && buttonDropSelectedFiles && divMessageContainer) {
        _inputImgElementCustomerCollectionImage = new InputImgElementCustomerCollectionImage(divInputImgContainer, img, divInputFileContainer,
            labelContainer, inputFile, buttonDropSelectedFiles, divMessageContainer);

        _inputImgElementCustomerCollectionImage.prepare();
    }
}

function prepareInputTextWithRuleElementCustomerCollectionTitleEdit() {
    let inputText = document.getElementById("input_text_customer_collection_title");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        let inputTextWithRuleElement = new InputTextWithRuleElement(inputTextElement, true);
        _inputTextWithRuleElementCustomerCollectionTitleEdit = new InputTextWithRuleElementCustomerCollectionTitleEdit(
            inputTextWithRuleElement);

        _inputTextWithRuleElementCustomerCollectionTitleEdit.prepare();
    }
}

async function prepareSelectWithRuleElementBooleanCustomerCollectionIsActive() {
    let select = document.getElementById("select_customer_collection_is_active");
    if (select) {
        _selectWithRuleElementBooleanCustomerCollectionIsActive = new SelectWithRuleElementBoolean(
            select, true, true);

        _selectWithRuleElementBooleanCustomerCollectionIsActive.prepare();
        await _selectWithRuleElementBooleanCustomerCollectionIsActive.fill();
    }
}

function prepareTextareaWithCounterElementCustomerCollectionDescription() {
    let divContainer = document.getElementById("div_textarea_customer_collection_description");
    let textarea = document.getElementById("textarea_customer_collection_description");
    let spanCounter = document.getElementById("span_counter_textarea_customer_collection_description");
    if (divContainer && textarea && spanCounter) {
        let textareaElement = new TextareaElement(textarea);
        _textareaElementCustomerCollectionDescription = new TextareaWithCounterElement(
            divContainer, textareaElement, spanCounter);
        _textareaElementCustomerCollectionDescription.changeMaxLength(255);

        _textareaElementCustomerCollectionDescription.prepare();
    }
}

async function prepareFormElementCustomerCollectionEdit() {
    let form = document.getElementById("form_customer_collection_edit");
    let buttonSubmit = document.getElementById("button_submit_customer_collection_edit");
    let divMessageContainer = document.getElementById("div_message_container_customer_collection_edit");
    let buttonDelete = document.getElementById("button_delete_customer_collection_edit");
    if (form && buttonSubmit && divMessageContainer && buttonDelete) {
        let buttonWithTextElement = new ButtonWithTextElement(buttonDelete);
        let buttonWithTextElementDoubleClickDelete = new ButtonWithTextElementDoubleClick(
            buttonWithTextElement);
        buttonWithTextElementDoubleClickDelete.prepare();

        _formElementCustomerCollectionEdit = new FormElementCustomerCollectionEdit(
            form, buttonSubmit, divMessageContainer, buttonWithTextElementDoubleClickDelete);
        _formElementCustomerCollectionEdit.setInputImgElementCustomerCollectionImage(
            _inputImgElementCustomerCollectionImage);
        _formElementCustomerCollectionEdit.setInputTextWithRuleElementCustomerCollectionTitleEdit(
            _inputTextWithRuleElementCustomerCollectionTitleEdit);
        _formElementCustomerCollectionEdit.setSelectWithRuleElementBooleanCustomerCollectionIsActive(
            _selectWithRuleElementBooleanCustomerCollectionIsActive);
        _formElementCustomerCollectionEdit.setTextareaWithCounterElementCustomerCollectionDescription(
            _textareaElementCustomerCollectionDescription);
        _formElementCustomerCollectionEdit.setCustomerCollectionId(_currentCustomerCollectionId);

        await _formElementCustomerCollectionEdit.prepare();
    }
}
//---

// Элменты таблицы + таблица "Изменение слов в коллекции" ---
function prepareButtonWithImgAndSpanElementSelectAllWordsForDelete() {
    let button = document.getElementById("button_select_all_words_for_delete");
    let span = document.getElementById("span_select_all_words_for_delete");
    let img = document.getElementById("img_select_all_words_for_delete");
    if (button && span && img) {
        let buttonWithImgAndSpanElement = new ButtonWithImgAndSpanElement(button, img, span);
        _buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndSpanElement);

        _buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.prepare();
    }
}

function prepareButtonWithImgAndSpanElementDeselectAllWordsForDelete() {
    let button = document.getElementById("button_deselect_all_words_for_delete");
    let span = document.getElementById("span_deselect_all_words_for_delete");
    let img = document.getElementById("img_deselect_all_words_for_delete");
    if (button && span && img) {
        let buttonWithImgAndSpanElement = new ButtonWithImgAndSpanElement(button, img, span);
        _buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndSpanElement);

        _buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.prepare();
    }
}

function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder_words_in_collection");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);

        _inputTextElementFinder.prepare();
    }
}

function prepareButtonElementRefresh() {
    let button = document.getElementById("button_refresh_words_in_collection");
    let img = document.getElementById("img_refresh_words_in_collection");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);

        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementWordsInCollectionEdit() {
    let table = document.getElementById("table_words_in_collection_edit");
    let colgroup = document.getElementById("colgroup_words_in_collection_edit");
    let thead = document.getElementById("thead_words_in_collection_edit");
    let tbody = document.getElementById("tbody_words_in_collection_edit");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWordsInCollectionEdit = new TableWithTimerElementWordsInCollectionEdit(
            table, colgroup, thead, tbody);
        _tableWithTimerElementWordsInCollectionEdit.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementWordsInCollectionEdit.setButtonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete(
            _buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete);
        _tableWithTimerElementWordsInCollectionEdit.setButtonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete(
            _buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete);
        _tableWithTimerElementWordsInCollectionEdit.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementWordsInCollectionEdit.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementWordsInCollectionEdit.setCustomerCollectionId(_currentCustomerCollectionId);

        await _tableWithTimerElementWordsInCollectionEdit.prepare();
    }
}
//---