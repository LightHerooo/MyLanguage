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
} from "../../classes/a_buttons.js";

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
    GlobalCookies
} from "../../classes/global_cookies.js";

class WordRowElements {
    divRow;
    tbTitleParent;
    tbTitle;
    cbLangsParent;
    cbLangs;
    aBtnDelete;

    constructor(divRow, tbTitleParent, tbTitle,
                cbLangsParent, cbLangs, aBtnDelete) {
        this.tbTitleParent = tbTitleParent
        this.tbTitle = tbTitle;
        this.cbLangsParent = cbLangsParent;
        this.cbLangs = cbLangs;
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
const _GLOBAL_COOKIES = new GlobalCookies();

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
let _newWordsMap = new Map();

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function() {
    prepareABtnNewWords();
    prepareSubmitSend();

    await createNewWordElement();
}

window.onbeforeunload = async function () {

}

function prepareABtnNewWords() {
    let aBtnNewWord = document.getElementById(_A_BTN_NEW_WORD_ID);
    if (aBtnNewWord) {
        aBtnNewWord.addEventListener("click", async function() {
            if (_newWordsMap.size < _MAX_NUMBER_OF_NEW_WORD_ITEMS) {
                clearNewWordsInfoContainer();
                await createNewWordElement();
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
async function createNewWordElement() {
    // Создаём поле "Название ---
    let lbTitle = document.createElement("label");
    lbTitle.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbTitle.textContent = "Слово:";

    let tbTitle = document.createElement("input");
    tbTitle.id = "tb_title" + "_" + _indexOfNewWord;
    tbTitle.type = "text";
    tbTitle.classList.add(_CSS_MAIN.INPUT_TEXT_STANDARD_STYLE_ID);

    let divTitle = document.createElement("div");
    divTitle.id = "div_title" + "_" + _indexOfNewWord;
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
    cbLangs.id = "cb_langs" + "_" + _indexOfNewWord;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let firstOption = document.createElement("option");
    firstOption.textContent = "Выберите язык";
    await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

    let divElementWithFlagContainer = document.createElement("div");
    divElementWithFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_ELEMENT_WITH_FLAG_CONTAINER_STYLE_ID);
    divElementWithFlagContainer.appendChild(cbLangs);
    divElementWithFlagContainer.appendChild(divFlagContainer);
    //---

    // Создаём контейнер со списком языков ---
    let lbLang = document.createElement("label");
    lbLang.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbLang.textContent = "Язык:";

    let divLang = document.createElement("div");
    divLang.id = "div_lang" + "_" + _indexOfNewWord;
    divLang.classList.add(_NEW_WORD_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(divElementWithFlagContainer);
    //---

    // Вешаем обработчики на каждый созданный объект ---
    tbTitle.addEventListener("input", async function () {
        clearNewWordsInfoContainer();
        await checkCorrectTitle(this, cbLangs, divTitle);
    })

    cbLangs.addEventListener("change", async function() {
        clearNewWordsInfoContainer();
        await checkCorrectLang(this, divLang);
        await checkCorrectTitle(tbTitle, this, divTitle);
    });
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

    // Внутри элемента создаём кнопку удаления
    let aBtnDelete = _A_BUTTONS.A_BUTTON_DENY.createA();
    aBtnDelete.addEventListener("click", function () {
        let isCorrect = true;
        let message;
        let ruleType;
        if (_newWordsMap.size === _MIN_NUMBER_OF_NEW_WORD_ITEMS) {
            isCorrect = false;
            message = `Новых коллекций не должно быть менее ${_MIN_NUMBER_OF_NEW_WORD_ITEMS}.`;
            ruleType = _RULE_TYPES.WARNING;
        }

        if (isCorrect === false) {
            showRuleInNewWordsInfoContainer(message, ruleType);
        } else {
            clearNewWordsInfoContainer();
            for (let key of _newWordsMap.keys()) {
                let wordRowElements = _newWordsMap.get(key);
                let itemTbTitle = wordRowElements.tbTitle;
                let itemCbLangs = wordRowElements.cbLangs;
                if (tbTitle.id === itemTbTitle.id
                    && cbLangs.id === itemCbLangs.id) {
                    _newWordsMap.delete(key);
                    break;
                }
            }

            let divCollectionsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
            divCollectionsContainer.removeChild(divNewWord);
        }
    });

    divNewWord.appendChild(divNewWordData);
    divNewWord.appendChild(aBtnDelete);
    //---

    // Добавляем собранный элемент в контейнер ---
    let divCollectionsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
    if (divCollectionsContainer != null) {
        divCollectionsContainer.appendChild(divNewWord);
    }
    //---

    // Добавляем элементы ввода в Map
    let newWordRowElements =
        new WordRowElements(divNewWord, divTitle, tbTitle, divLang, cbLangs, aBtnDelete);
    _newWordsMap.set(_indexOfNewWord++, newWordRowElements);
    //---
}

async function checkCorrectTitle(tbTitle, tbLangs, parentElement) {
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(tbLangs);
    return await _WORD_UTILS.checkCorrectValueInTbTitle(tbTitle, parentElement, langCode, _CUSTOM_TIMER_CHECKER);
}

async function checkCorrectLang(cbLangs, parentElement) {
    return await _LANG_UTILS.checkCorrectValueInComboBox(cbLangs, parentElement);
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newWordsMap.keys()) {
        let row = _newWordsMap.get(iKey);

        let iTbTitle = row.tbTitle;
        let iTitleValue = iTbTitle.value.toLowerCase().trim();
        let iLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(row.cbLangs);

        let isCorrectOne = true;
        let ruleElement = new RuleElement(iTbTitle, iTbTitle.parentElement);

        for (let jKey of _newWordsMap.keys()) {
            if (iKey === jKey) continue;
            let jWordRowElements = _newWordsMap.get(jKey);

            let jTitleValue = jWordRowElements.tbTitle.value.toLowerCase().trim();
            let jLangCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(jWordRowElements.cbLangs);
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
    for (let key of _newWordsMap.keys()) {
        let row = _newWordsMap.get(key);

        let titleIsCorrect =
            await checkCorrectTitle(row.tbTitle, row.cbLangs, row.tbTitleParent);
        let langIsCorrect = await checkCorrectLang(row.cbLangs, row.cbLangsParent);

        if (isCorrect === true) {
            isCorrect = (titleIsCorrect && langIsCorrect);
        }
    }

    if (isCorrect === true) {
        isCorrect = checkAllTitles();
    }

    return isCorrect;
}

async function sendNewWords() {
    let acceptWordKeys = [];
    for (let key of _newWordsMap.keys()) {
        let wordRowElements = _newWordsMap.get(key);

        let dto = new WordRequestDTO();
        dto.title = wordRowElements.tbTitle.value.trim();
        dto.customerId = BigInt(_GLOBAL_COOKIES.AUTH_ID.getValue());
        dto.langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(wordRowElements.cbLangs);

        let JSONResponse = await _WORDS_API.POST.add(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            acceptWordKeys.push(key);
        }
    }

    let isCorrect = true;
    let message;
    let ruleType;
    if (acceptWordKeys.length !== _newWordsMap.size) {
        isCorrect = false;
        message = "Произошла ошибка при попытке предложения некоторых слов. Попробуйте ещё раз.";
        ruleType = _RULE_TYPES.ERROR;

        for (let i = 0; i < acceptWordKeys.length; i++) {
            let key = acceptWordKeys[i];
            let divRow = _newWordsMap.get(key).divRow;
            divRow.parentNode.removeChild(divRow);

            _newWordsMap.delete(acceptWordKeys[i]);
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
    for (let key of _newWordsMap.keys()) {
        let row = _newWordsMap.get(key);
        if (row) {
            row.tbTitle.disabled = isDisable;
            row.cbLangs.disabled = isDisable;

            let aBtnDelete = row.aBtnDelete;
            if (aBtnDelete) {
                if (isDisable === true) {
                    _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnDelete);
                } else {
                    _A_BUTTONS.A_BUTTON_DENY.setStyles(aBtnDelete);
                }
            }
        }
    }
    //---
}
//---