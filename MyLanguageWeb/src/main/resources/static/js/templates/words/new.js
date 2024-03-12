import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    WordRequestDTO
} from "../../classes/dto/entity/word.js";

import {
    RuleElement
} from "../../classes/rule/rule_element.js";

import {
    RuleTypes
} from "../../classes/rule/rule_types.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    WordUtils
} from "../../classes/utils/entity/word_utils.js";

import {
    WordsAPI
} from "../../classes/api/words_api.js";

import {
    AButtons
} from "../../classes/a_buttons/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    CssElementWithFlag
} from "../../classes/css/other/css_element_with_flag.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    AButtonImgSizes
} from "../../classes/a_buttons/a_button_img_sizes.js";

import {
    ComboBoxWithFlag
} from "../../classes/element_with_flag/combo_box_with_flag.js";

class WordRow {
    divRow;
    tbTitle;
    cbLangsWithFlag;
    aBtnDelete;

    constructor(divRow, tbTitle, cbLangsWithFlag, aBtnDelete) {
        this.divRow = divRow;
        this.tbTitle = tbTitle;
        this.cbLangsWithFlag = cbLangsWithFlag;
        this.aBtnDelete = aBtnDelete;
    }
}

const _WORDS_API = new WordsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ELEMENT_WITH_FLAG = new CssElementWithFlag();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _WORD_UTILS = new WordUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

const _NEW_WORD_DATA_ITEM_STYLE_ID = "new-word-data-item";
const _NEW_WORD_DATA_STYLE_ID = "new-word-data";
const _NEW_WORDS_CONTAINER_ITEM_STYLE_ID = "new-words-container-item";
const _A_BTN_NEW_WORD_STYLE_ID = "a-btn-new-word";

const _A_BTN_NEW_WORD_ID = "a_btn_new_word";
const _DIV_SEND_NEW_WORDS_INFO_ID = "send_new_words_info";
const _DIV_NEW_WORDS_CONTAINER_ID = "new_words_container";
const _FORM_SEND_ID = "submit_send";
const _BTN_SEND = "btn_send";

const _MIN_NUMBER_OF_NEW_WORD_ITEMS = 1;
const _MAX_NUMBER_OF_NEW_WORD_ITEMS = 5;

let _indexOfNewWord = 0;
let _newWordRowsMap = new Map();

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function() {
    prepareABtnNewWords();
    prepareSubmitSend();

    await createNewWordRow();
}

window.onbeforeunload = async function () {

}

function prepareABtnNewWords() {
    let aBtnNewWord = document.getElementById(_A_BTN_NEW_WORD_ID);
    if (aBtnNewWord) {
        aBtnNewWord.addEventListener("click", async function() {
            if (_newWordRowsMap.size < _MAX_NUMBER_OF_NEW_WORD_ITEMS) {
                clearNewWordsInfoContainer();
                await createNewWordRow();
            } else {
                let message = `За раз можно предложить не более ${_MAX_NUMBER_OF_NEW_WORD_ITEMS} слов.`;
                let ruleType = _RULE_TYPES.WARNING;
                showRuleInNewWordsInfoContainer(message, ruleType);
            }
        });
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_FORM_SEND_ID);
    submitSend.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Блокируем элементы и показываем загрузку ---
        changeDisableStatusInImportantElements(true);

        clearNewWordsInfoContainer();
        let divSendNewWordsInfo = document.getElementById(_DIV_SEND_NEW_WORDS_INFO_ID);
        if (divSendNewWordsInfo) {
            let divLoading = new LoadingElement().createDiv();
            divLoading.style.justifyContent = "left";
            divSendNewWordsInfo.appendChild(divLoading);
        }
        //---

        if (await checkBeforeSend() === true) {
            if (await sendNewWords() === true) {
                window.onbeforeunload = null;
                submitSend.submit();
            } else {
                changeDisableStatusInImportantElements(false);
            }
        } else {
            clearNewWordsInfoContainer();
            changeDisableStatusInImportantElements(false);
        }
    })
}

// Предложение новых слов ---
async function createNewWordRow() {
    // Создаём поле "Название ---
    let lbTitle = document.createElement("label");
    lbTitle.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbTitle.textContent = "Слово:";

    let tbTitle = document.createElement("input");
    tbTitle.id = `tb_title_${_indexOfNewWord}`;
    tbTitle.type = "text";
    tbTitle.classList.add(_CSS_MAIN.INPUT_TEXT_STANDARD_STYLE_ID);

    let divTitle = document.createElement("div");
    divTitle.classList.add(_NEW_WORD_DATA_ITEM_STYLE_ID);
    divTitle.appendChild(lbTitle);
    divTitle.appendChild(tbTitle);
    //---

    // Создаём выпадающий список "Язык" с флагом ---
    let divLangFlag = document.createElement("div");
    let divFlagContainer = document.createElement("div");
    divFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_FLAG_CONTAINER_STYLE_ID);
    divFlagContainer.appendChild(divLangFlag);

    let cbLangs = document.createElement("select");
    cbLangs.id = `cb_langs_${_indexOfNewWord}`;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let divElementWithFlagContainer = document.createElement("div");
    divElementWithFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_ELEMENT_WITH_FLAG_CONTAINER_STYLE_ID);
    divElementWithFlagContainer.appendChild(cbLangs);
    divElementWithFlagContainer.appendChild(divFlagContainer);

    let lbLang = document.createElement("label");
    lbLang.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbLang.textContent = "Язык:";

    let divLang = document.createElement("div");
    divLang.classList.add(_NEW_WORD_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(divElementWithFlagContainer);
    //---

    // Создаём элемент "Данные нового слова" ---
    let divNewWordData = document.createElement("div");
    divNewWordData.classList.add(_NEW_WORD_DATA_STYLE_ID);
    divNewWordData.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
    divNewWordData.appendChild(divTitle);
    divNewWordData.appendChild(divLang);
    //---

    // Создаём элемент "Новое слово" ---
    let divNewWord = document.createElement("div");
    divNewWord.classList.add(_NEW_WORDS_CONTAINER_ITEM_STYLE_ID);
    divNewWord.appendChild(divNewWordData);
    //---

    // Создаём кнопку "Удалить" ---
    let aBtnDelete = _A_BUTTONS.A_BUTTON_DENY.createA(_A_BUTTON_IMG_SIZES.SIZE_32);
    divNewWord.appendChild(aBtnDelete);
    //---

    // Добавляем элементы в мапу ---
    let cbLangsWithFlag = new ComboBoxWithFlag(divLang, cbLangs, divLangFlag);

    let newWordRow =
        new WordRow(divNewWord, tbTitle, cbLangsWithFlag, aBtnDelete);
    _newWordRowsMap.set(_indexOfNewWord++, newWordRow);
    //---

    // Подготавливаем поле "Название" ---
    tbTitle.addEventListener("input", async function () {
        clearNewWordsInfoContainer();
        await checkCorrectTitle(newWordRow);
    })
    //---

    // Подготавливаем выпадающий список "Языки" ---
    let firstOption = document.createElement("option");
    firstOption.textContent = "Выберите язык";
    await _LANG_UTILS.CB_LANGS_IN.prepare(cbLangsWithFlag, firstOption, true);

    cbLangs.addEventListener("change", async function() {
        clearNewWordsInfoContainer();
        await checkCorrectTitle(newWordRow);
    });
    //---

    // Подготавливаем кнопку "Удалить" ---
    aBtnDelete.addEventListener("click", function () {
        let isCorrect = true;
        let message;
        let ruleType;
        if (_newWordRowsMap.size === _MIN_NUMBER_OF_NEW_WORD_ITEMS) {
            isCorrect = false;
            message = `Новых слов не должно быть менее ${_MIN_NUMBER_OF_NEW_WORD_ITEMS}.`;
            ruleType = _RULE_TYPES.WARNING;
        }

        if (isCorrect === false) {
            showRuleInNewWordsInfoContainer(message, ruleType);
        } else {
            clearNewWordsInfoContainer();
            for (let key of _newWordRowsMap.keys()) {
                let wordRow = _newWordRowsMap.get(key);
                if (wordRow.divRow === divNewWord) {
                    _newWordRowsMap.delete(key);
                    break;
                }
            }

            let divNewWordsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
            divNewWordsContainer.removeChild(divNewWord);
        }
    });
    //---

    // Добавляем собранный элемент в контейнер ---
    let divNewWordsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
    if (divNewWordsContainer != null) {
        divNewWordsContainer.appendChild(divNewWord);
    }
    //---
}

async function checkCorrectTitle(wordRow) {
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(wordRow.cbLangsWithFlag.comboBox);
    return await _WORD_UTILS.TB_WORD_TITLE.checkCorrectValue(wordRow.tbTitle, langCode, _CUSTOM_TIMER_CHECKER);
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newWordRowsMap.keys()) {
        let row = _newWordRowsMap.get(iKey);

        let iTbTitle = row.tbTitle;
        let iTitleValue = iTbTitle.value.toLowerCase().trim();
        let iLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(row.cbLangsWithFlag.comboBox);

        let isCorrectOne = true;
        let ruleElement = new RuleElement(iTbTitle, iTbTitle.parentElement);
        for (let jKey of _newWordRowsMap.keys()) {
            if (iKey === jKey) continue;
            let jWordRow = _newWordRowsMap.get(jKey);

            let jTitleValue = jWordRow.tbTitle.value.toLowerCase().trim();
            let jLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(jWordRow.cbLangsWithFlag.comboBox);
            if (iTitleValue === jTitleValue
                && iLangCode === jLangCode) {
                isCorrectAll = false;
                isCorrectOne = false;

                ruleElement.message = "Языки в словах с одинаковым названием не должны повторяться.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
                break;
            }
        }

        // Отображаем предупреждение (правило), если это необходимо ---
        if (isCorrectOne === false) {
            ruleElement.showRule();
        } else {
            ruleElement.removeRule();
        }
        //---
    }

    return isCorrectAll;
}

async function checkBeforeSend() {
    let isCorrect = true;
    for (let key of _newWordRowsMap.keys()) {
        let row = _newWordRowsMap.get(key);
        let titleIsCorrect =
            await checkCorrectTitle(row);
        let langIsCorrect = await _LANG_UTILS.CB_LANGS_IN.checkCorrectValue(row.cbLangsWithFlag);

        if (isCorrect === true) {
            isCorrect = (titleIsCorrect === true
                && langIsCorrect === true);
        }
    }

    if (isCorrect === true) {
        isCorrect = checkAllTitles();
    }

    return isCorrect;
}

async function sendNewWords() {
    let acceptWordKeys = [];
    for (let key of _newWordRowsMap.keys()) {
        let wordRow = _newWordRowsMap.get(key);
        if (wordRow) {
            let tbTitle = wordRow.tbTitle;
            let cbLangs = wordRow.cbLangsWithFlag.comboBox;
            if (tbTitle && cbLangs) {
                let dto = new WordRequestDTO();
                dto.title = tbTitle.value.trim();
                dto.langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);

                let JSONResponse = await _WORDS_API.POST.add(dto);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    acceptWordKeys.push(key);
                }
            }
        }
    }

    let isCorrect = true;
    let message;
    let ruleType;
    if (acceptWordKeys.length !== _newWordRowsMap.size) {
        isCorrect = false;
        message = "Произошла ошибка при попытке предложения некоторых слов. Попробуйте ещё раз.";
        ruleType = _RULE_TYPES.ERROR;
    }

    if (isCorrect === false) {
        for (let i = 0; i < acceptWordKeys.length; i++) {
            let wordRow = _newWordRowsMap.get(acceptWordKeys[i]);
            if (wordRow) {
                let divRow = wordRow.divRow;

                divRow.parentNode.removeChild(divRow);
                _newWordRowsMap.delete(acceptWordKeys[i]);
            }
        }
    }

    if (isCorrect === false) {
        showRuleInNewWordsInfoContainer(message, ruleType);
    }

    return isCorrect;
}

function clearNewWordsInfoContainer() {
    let divSendNewWordsInfo = document.getElementById(_DIV_SEND_NEW_WORDS_INFO_ID);
    if (divSendNewWordsInfo) {
        divSendNewWordsInfo.replaceChildren();
    }
}

function showRuleInNewWordsInfoContainer(message, ruleType) {
    let divSendNewWordsInfo = document.getElementById(_DIV_SEND_NEW_WORDS_INFO_ID);
    if (divSendNewWordsInfo) {
        clearNewWordsInfoContainer();

        let ruleElement = new RuleElement(divSendNewWordsInfo, divSendNewWordsInfo);
        ruleElement.message = message;
        ruleElement.ruleType = ruleType;
        ruleElement.showRule();
    }
}

function changeDisableStatusInImportantElements(isDisable) {
    // Кнопка "Предложить" ---
    let btnSend = document.getElementById(_BTN_SEND);
    if (btnSend) {
        btnSend.disabled = isDisable;
    }
    //---

    // Кнопка "Добавить новое слово" ---
    let aBtnNewWord = document.getElementById(_A_BTN_NEW_WORD_ID);
    if (aBtnNewWord) {
        if (isDisable === true) {
            aBtnNewWord.className = "";
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnNewWord);
            aBtnNewWord.classList.add(_A_BTN_NEW_WORD_STYLE_ID);
        } else {
            aBtnNewWord.className = "";
            aBtnNewWord.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
            aBtnNewWord.classList.add(_A_BTN_NEW_WORD_STYLE_ID);
        }
    }
    //---

    // Элементы каждого предложенного слова ---
    for (let key of _newWordRowsMap.keys()) {
        let row = _newWordRowsMap.get(key);
        if (row) {
            row.tbTitle.disabled = isDisable;

            let cbLangsWithFlag = row.cbLangsWithFlag;
            if (cbLangsWithFlag) {
                cbLangsWithFlag.comboBox.disabled = isDisable;
            }

            let aBtnDelete = row.aBtnDelete;
            if (aBtnDelete) {
                if (isDisable === true) {
                    _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnDelete);
                } else {
                    _A_BUTTONS.A_BUTTON_DENY.setStyles(aBtnDelete, _A_BUTTON_IMG_SIZES.SIZE_32);
                }
            }
        }
    }
    //---
}
//---