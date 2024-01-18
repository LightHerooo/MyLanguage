import {
    buildABtnAccept,
    buildABtnDisabled,
    createABtnDeny
} from "../../utils/btn_utils.js";

import {
    changeRuleStatus,
    getOrCreateRule
} from "../../utils/div_rules.js";

import {
    checkCorrectCbLangs, checkCorrectCbPartsOfSpeech,
    fillCbLangs,
    fillCbPartsOfSpeech, getSelectedOptionId
} from "../../utils/combo_box_utils.js";

import {
    checkCorrectWordTitle
} from "../../utils/text_box_utils.js";

import {
    Timer
} from "../../classes/timer.js";

import {
    postJSONResponseAddSeveralWords
} from "../../api/words.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    WordRequestDTO
} from "../../dto/word.js";

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();

const _NEW_WORD_DATA_ITEM_STYLE_ID = "new-word-data-item";
const _NEW_WORD_DATA_STYLE_ID = "new-word-data";
const _NEW_WORDS_CONTAINER_ITEM_STYLE_ID = "new-words-container-item";
const _BTN_NEW_WORD_STYLE_ID = "btn-new-word";

const _BTN_NEW_WORD_ID = "btn_new_word";
const _DIV_SEND_NEW_WORDS_INFO_ID = "send_new_words_info";
const _DIV_NEW_WORDS_CONTAINER_ID = "new_words_container";
const _SUBMIT_SEND_ID = "submit_send";
const _SUBMIT_BTN_ID = "submit_btn";

const _MIN_NUMBER_OF_NEW_WORD_ITEMS = 1;
const _MAX_NUMBER_OF_NEW_WORD_ITEMS = 5;

let _indexOfNewWord = 0;
let _newWordsMap = new Map();

let _T_CHECKER_MILLISECONDS = 250;
let _tChecker = new Timer(null);

class WordRowElements {
    tbTitle;
    cbLangs;
    cbPartsOfSpeech;

    constructor(tbTitle, cbLangs, cbPartsOfSpeech) {
        this.tbTitle = tbTitle;
        this.cbLangs = cbLangs;
        this.cbPartsOfSpeech = cbPartsOfSpeech;
    }
}

window.onload = async function() {
    changeBtnNewWordStatus();
    prepareSubmitSend();

    await createNewWordElement();
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let submitBtn = document.getElementById(_SUBMIT_BTN_ID);
    submitSend.addEventListener("submit", async function(event) {
        submitBtn.disabled = true;
        event.preventDefault();

        if (await checkBeforeSend() && await sendNewWords()) {
            submitSend.submit();
        }

        submitBtn.disabled = false;
    })
}

function buildBtnNewWord() {
    let btnNewWord = document.getElementById(_BTN_NEW_WORD_ID);
    btnNewWord.classList.add(_BTN_NEW_WORD_STYLE_ID);
}

function changeBtnNewWordStatus() {
    let btnNewWord = document.getElementById(_BTN_NEW_WORD_ID);
    if (btnNewWord != null) {
        buildABtnDisabled(btnNewWord);
        buildBtnNewWord();
        btnNewWord.onclick = null;

        if (_newWordsMap.size < _MAX_NUMBER_OF_NEW_WORD_ITEMS) {
            buildABtnAccept(btnNewWord, true);
            buildBtnNewWord();

            btnNewWord.title = "Предложить новое слово.";
            btnNewWord.onclick = async function() {
                changeSendNewWordsInfoRule(null, true);
                await createNewWordElement();
                changeBtnNewWordStatus();
            }
        } else {
            btnNewWord.title = `За раз можно предложить не более ${_MAX_NUMBER_OF_NEW_WORD_ITEMS} слов.`;
        }
    }
}

function changeSendNewWordsInfoRule(text, isRuleCorrect) {
    let divRuleElement = getOrCreateRule(_DIV_SEND_NEW_WORDS_INFO_ID + "_div_rule");
    divRuleElement.textContent = text;
    changeRuleStatus(divRuleElement, _DIV_SEND_NEW_WORDS_INFO_ID, isRuleCorrect);
}

async function createNewWordElement() {
    // Создаём поле "Название ---
    let lbTitle = document.createElement("label");
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

    // Создаём выпадающий список "Часть речи" ---
    let lbPartOfSpeech = document.createElement("label");
    lbPartOfSpeech.textContent = "Часть речи:";

    let cbPartsOfSpeech = document.createElement("select");
    cbPartsOfSpeech.id = "cb_parts_of_speech" + "_" + _indexOfNewWord;
    cbPartsOfSpeech.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let firstOption = document.createElement("option");
    firstOption.textContent = "Выберите часть речи";
    cbPartsOfSpeech.appendChild(firstOption);
    await fillCbPartsOfSpeech(cbPartsOfSpeech);

    let divPartOfSpeech = document.createElement("div");
    divPartOfSpeech.id = "div_part_of_speech" + "_" + _indexOfNewWord;
    divPartOfSpeech.classList.add(_NEW_WORD_DATA_ITEM_STYLE_ID);
    divPartOfSpeech.appendChild(lbPartOfSpeech);
    divPartOfSpeech.appendChild(cbPartsOfSpeech);
    //---

    // Создаём выпадающий список "Язык" ---
    let lbLang = document.createElement("label");
    lbLang.textContent = "Язык:";

    let cbLangs = document.createElement("select");
    cbLangs.id = "cb_langs" + "_" + _indexOfNewWord;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    firstOption = document.createElement("option");
    firstOption.textContent = "Выберите язык";
    cbLangs.appendChild(firstOption);
    await fillCbLangs(cbLangs);

    let divLang = document.createElement("div");
    divLang.id = "div_lang" + "_" + _indexOfNewWord;
    divLang.classList.add(_NEW_WORD_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(cbLangs);
    //---

    // Вешаем обработчики на каждый созданный объект ---
    tbTitle.addEventListener("input", async function () {
        changeSendNewWordsInfoRule(null, true);
        await checkCorrectTitle(this, cbLangs, cbPartsOfSpeech);
    })

    cbLangs.addEventListener("change", async function() {
        changeSendNewWordsInfoRule(null, true);
        await checkCorrectLang(this);
        await checkCorrectTitle(tbTitle, this, cbPartsOfSpeech);
    });

    cbPartsOfSpeech.addEventListener("change", async function() {
        changeSendNewWordsInfoRule(null, true);
        await checkCorrectPartOfSpeech(this);
        await checkCorrectTitle(tbTitle, cbLangs, this);
    });
    //---

    // Создаём элемент "Данные нового слова" ---
    let divNewWordData = document.createElement("div");
    divNewWordData.classList.add(_NEW_WORD_DATA_STYLE_ID);
    divNewWordData.classList.add(_CSS_MAIN.DIV_BLOCK_INFO_STANDARD_STYLE_ID);
    divNewWordData.appendChild(divTitle);
    divNewWordData.appendChild(divLang);
    divNewWordData.appendChild(divPartOfSpeech);
    //---

    // Создаём элемент "Новое слово" ---
    let divNewWord = document.createElement("div");
    divNewWord.classList.add(_NEW_WORDS_CONTAINER_ITEM_STYLE_ID);

    // Внутри элемента создаём кнопку удаления
    let aDeleteButton = createABtnDeny();
    aDeleteButton.addEventListener("click", function () {
        if (_newWordsMap.size > _MIN_NUMBER_OF_NEW_WORD_ITEMS) {
            changeSendNewWordsInfoRule(null, true);
            for (let key of _newWordsMap.keys()) {
                let wordRowElements = _newWordsMap.get(key);
                let itemTbTitle = wordRowElements.tbTitle;
                let itemCbLangs = wordRowElements.cbLangs;
                let itemCbPartsOfSpeech = wordRowElements.cbPartsOfSpeech;
                if (tbTitle.id === itemTbTitle.id
                    && cbLangs.id === itemCbLangs.id
                    && cbPartsOfSpeech.id === itemCbPartsOfSpeech.id) {
                    _newWordsMap.delete(key);
                    break;
                }
            }

            let divCollectionsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
            divCollectionsContainer.removeChild(divNewWord);
            changeBtnNewWordStatus();
        } else {
            let text = `Новых коллекций не должно быть менее ${_MIN_NUMBER_OF_NEW_WORD_ITEMS}.`;
            changeSendNewWordsInfoRule(text, false);
        }
    });

    divNewWord.appendChild(divNewWordData);
    divNewWord.appendChild(aDeleteButton);
    //---

    // Добавляем собранный элемент в контейнер ---
    let divCollectionsContainer = document.getElementById(_DIV_NEW_WORDS_CONTAINER_ID);
    if (divCollectionsContainer != null) {
        divCollectionsContainer.appendChild(divNewWord);
    }
    //---

    // Добавляем элементы ввода в Map
    let newWordRowElements = new WordRowElements(tbTitle, cbLangs, cbPartsOfSpeech);
    _newWordsMap.set(_indexOfNewWord++, newWordRowElements);
    //---
}

async function checkCorrectTitle(tbTitle, tbLangs, cbPartsOfSpeech) {
    const DIV_RULE_ID = tbTitle.id + "_div_rule";
    let langCode = getSelectedOptionId(tbLangs.id);
    let partOfSpeechCode = getSelectedOptionId(cbPartsOfSpeech.id);

    return await checkCorrectWordTitle(tbTitle, langCode, partOfSpeechCode,
        DIV_RULE_ID, _tChecker, _T_CHECKER_MILLISECONDS);
}

async function checkCorrectLang(cbLangs) {
    const DIV_RULE_ID = cbLangs.id + "_div_rule";
    const PARENT_ID = cbLangs.parentNode.id;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let langCode = getSelectedOptionId(cbLangs.id);
    if (!langCode) {
        isCorrect = false;
        divRuleElement.textContent = "Выберите язык.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else {
        isCorrect = await checkCorrectCbLangs(cbLangs, DIV_RULE_ID);
    }

    return isCorrect;
}

async function checkCorrectPartOfSpeech(cbPartsOfSpeech) {
    const DIV_RULE_ID = cbPartsOfSpeech.id + "_div_rule";
    const PARENT_ID = cbPartsOfSpeech.parentNode.id;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let partOfSpeechCode = getSelectedOptionId(cbPartsOfSpeech.id);
    if (!partOfSpeechCode) {
        isCorrect = false;
        divRuleElement.textContent = "Выберите часть речи.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else {
        isCorrect = await checkCorrectCbPartsOfSpeech(cbPartsOfSpeech, DIV_RULE_ID);
    }

    return isCorrect;
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newWordsMap.keys()) {
        let iWordRowElements = _newWordsMap.get(iKey);
        let iTbTitle = iWordRowElements.tbTitle;
        const DIV_RULE_ID = iTbTitle.id + "_div_rule";
        const PARENT_ID = iTbTitle.parentElement.id;

        let iTitleValue = iTbTitle.value.toLowerCase().trim();
        let iLangCode = getSelectedOptionId(iWordRowElements.cbLangs.id);
        let iPartOfSpeechCode = getSelectedOptionId(iWordRowElements.cbPartsOfSpeech.id);

        let isCorrectOne = true;
        let divRuleElement = getOrCreateRule(DIV_RULE_ID);
        for (let jKey of _newWordsMap.keys()) {
            if (iKey === jKey) continue;
            let jWordRowElements = _newWordsMap.get(jKey);

            let jTitleValue = jWordRowElements.tbTitle.value.toLowerCase().trim();
            let jLangCode = getSelectedOptionId(jWordRowElements.cbLangs.id);
            let jPartOfSpeechCode = getSelectedOptionId(jWordRowElements.cbPartsOfSpeech.id);
            if (iTitleValue === jTitleValue
                && iLangCode === jLangCode
                && iPartOfSpeechCode === jPartOfSpeechCode) {
                isCorrectAll = false;
                isCorrectOne = false;
                divRuleElement.textContent = "Язык и часть речи в словах с одинаковым названием не должны повторяться.";
                break;
            }
        }

        changeRuleStatus(divRuleElement, PARENT_ID, isCorrectOne);
    }

    return isCorrectAll;
}

async function checkBeforeSend() {
    let isCorrect = true;
    for (let key of _newWordsMap.keys()) {
        let wordRowElements = _newWordsMap.get(key);

        let titleIsCorrect =
            await checkCorrectTitle(wordRowElements.tbTitle, wordRowElements.cbLangs, wordRowElements.cbPartsOfSpeech);
        let langIsCorrect = await checkCorrectLang(wordRowElements.cbLangs);
        let partOfSpeechIsCorrect = await checkCorrectPartOfSpeech(wordRowElements.cbPartsOfSpeech);

        if (isCorrect) {
            isCorrect = (titleIsCorrect && langIsCorrect && partOfSpeechIsCorrect);
        }
    }

    if (isCorrect) {
        isCorrect = checkAllTitles();
    }

    return isCorrect;
}

async function sendNewWords() {
    let newWords = [];
    for (let key of _newWordsMap.keys()) {
        let wordRowElements = _newWordsMap.get(key);

        let dto = new WordRequestDTO();
        dto.title = wordRowElements.tbTitle.value.trim();
        dto.langCode = getSelectedOptionId(wordRowElements.cbLangs.id);
        dto.partOfSpeechCode = getSelectedOptionId(wordRowElements.cbPartsOfSpeech.id);

        newWords.push(dto);
    }

    let isCorrect = true;
    let JSONResponse = await postJSONResponseAddSeveralWords(newWords);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        let json = JSONResponse.json;
        changeSendNewWordsInfoRule(json["text"], false);
    }

    return isCorrect;
}