import {
    checkCorrectCbLangs,
    fillCbLangs, getSelectedOptionId
} from "../../utils/combo_box_utils.js";

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
    postJSONResponseAddSeveralCollections
} from "../../api/customer_collections.js";

import {
    checkCorrectCustomerCollectionTitle
} from "../../utils/text_box_utils.js";

import {
    Timer
} from "../../classes/timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CustomerCollectionRequestDTO
} from "../../dto/customer_collection.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

class CustomerCollectionRowElements {
    tbTitle;
    cbLangs;

    constructor(tbTitle, cbLangs) {
        this.tbTitle = tbTitle;
        this.cbLangs = cbLangs;
    }
}

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();

const NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID = "new-collections-container-item";
const NEW_COLLECTION_DATA_STYLE_ID = "new-collection-data";
const NEW_COLLECTION_DATA_ITEM_STYLE_ID = "new-collection-data-item";

const _NEW_COLLECTIONS_CONTAINER_ID = "new_collections_container";
const _BTN_NEW_COLLECTION_ID = "btn_new_collection";
const _SEND_NEW_COLLECTIONS_INFO_ID = "send_new_collections_info";
const _SUBMIT_SEND_ID = "submit_send";
const _SUBMIT_BTN_ID = "submit_btn";

const _BTN_NEW_COLLECTION_STYLE = "btn-new-collection";

const MIN_NUMBER_OF_NEW_COLLECTION_ITEMS = 1;
const MAX_NUMBER_OF_NEW_COLLECTION_ITEMS = 5;

let _T_CHECKER_MILLISECONDS = 250;
let _tChecker = new Timer(null);

let _indexOfNewCollection = 0;
let _newCollectionsMap = new Map();

window.onload = async function () {
    changeBtnNewCollectionStatus();

    prepareSubmitSend();
    await createNewCollectionElement();
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let submitBtn = document.getElementById(_SUBMIT_BTN_ID);
    submitSend.addEventListener("submit", async function(event) {
        submitBtn.disabled = true;
        event.preventDefault();

        if (await checkBeforeSend() && await sendNewCollections()) {
            submitSend.submit();
        }

        submitBtn.disabled = false;
    })
}

async function createNewCollectionElement() {
    // Создаём поле "Название" ---
    let lbTitle = document.createElement("label");
    lbTitle.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbTitle.textContent = "Название:";

    let tbTitle = document.createElement("input");
    tbTitle.id = "tb_title" + "_" + _indexOfNewCollection;
    tbTitle.type = "text";
    tbTitle.classList.add(_CSS_MAIN.INPUT_TEXT_STANDARD_STYLE_ID);

    tbTitle.addEventListener("input", async function () {
        changeSendNewCollectionInfoRule(null, true);
        await checkCorrectTitle(this);
    })

    let divTitle = document.createElement("div");
    divTitle.id = "div_title" + "_" + _indexOfNewCollection;
    divTitle.classList.add(NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divTitle.appendChild(lbTitle);
    divTitle.appendChild(tbTitle);
    //---

    // Создаём выпадающий список "Язык" ---
    let lbLang = document.createElement("label");
    lbLang.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbLang.textContent = "Язык:";

    let cbLangs = document.createElement("select");
    cbLangs.id = "cb_langs" + "_" + _indexOfNewCollection;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let firstOption = document.createElement("option");
    firstOption.textContent = "Все";
    cbLangs.appendChild(firstOption);
    await fillCbLangs(cbLangs);

    cbLangs.addEventListener("change", async function() {
        changeSendNewCollectionInfoRule(null, true);
        await checkCorrectLang(this);
    });

    let divLang = document.createElement("div");
    divLang.id = "div_lang" + "_" + _indexOfNewCollection;
    divLang.classList.add(NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(cbLangs);
    //---

    // Создаём элемент "Данные новой коллекции" ---
    let divNewCollectionData = document.createElement("div");
    divNewCollectionData.classList.add(NEW_COLLECTION_DATA_STYLE_ID);
    divNewCollectionData.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
    divNewCollectionData.appendChild(divTitle);
    divNewCollectionData.appendChild(divLang);
    //---

    // Создаём элемент "Новая коллекция" ---
    let divNewCollection = document.createElement("div");
    divNewCollection.classList.add(NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID);

    // Внутри элемента создаём кнопку удаления
    let aDeleteButton = createABtnDeny();
    aDeleteButton.addEventListener("click", function () {
        if (_newCollectionsMap.size > MIN_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            changeSendNewCollectionInfoRule(null, true);
            for (let key of _newCollectionsMap.keys()) {
                let customerCollectionRowElements = _newCollectionsMap.get(key);
                let iTbTitle = customerCollectionRowElements.tbTitle;
                let iCbLangs = customerCollectionRowElements.cbLangs;
                if (tbTitle.id === iTbTitle.id
                    && cbLangs.id === iCbLangs.id) {
                    _newCollectionsMap.delete(key);
                    break;
                }
            }

            let divCollectionsContainer = document.getElementById(_NEW_COLLECTIONS_CONTAINER_ID);
            divCollectionsContainer.removeChild(divNewCollection);
            changeBtnNewCollectionStatus();
        } else {
            let text = `Новых коллекций не должно быть менее ${MIN_NUMBER_OF_NEW_COLLECTION_ITEMS}.`;
            changeSendNewCollectionInfoRule(text, false);
        }
    });

    divNewCollection.appendChild(divNewCollectionData);
    divNewCollection.appendChild(aDeleteButton);
    //---

    // Добавляем собранный элемент в контейнер ---
    let divCollectionsContainer = document.getElementById(_NEW_COLLECTIONS_CONTAINER_ID);
    if (divCollectionsContainer != null) {
        divCollectionsContainer.appendChild(divNewCollection);
    }
    //---

    // Добавляем элементы ввода в Map ---
    let customerCollectionRowElements =
        new CustomerCollectionRowElements(tbTitle, cbLangs);
    _newCollectionsMap.set(_indexOfNewCollection++, customerCollectionRowElements);
    //---
}

async function checkCorrectTitle(tbTitle) {
    const DIV_RULE_ID = tbTitle.id + "_div_rule";
    return await checkCorrectCustomerCollectionTitle(tbTitle, DIV_RULE_ID, _tChecker, _T_CHECKER_MILLISECONDS);
}

async function checkCorrectLang(cbLangs) {
    const DIV_RULE_ID = cbLangs.id + "div_rule";

    let isCorrect = true;
    let langCode = getSelectedOptionId(cbLangs.id);
    if (langCode) {
        isCorrect = checkCorrectCbLangs(cbLangs, DIV_RULE_ID, cbLangs.parentElement.id);
    }

    return isCorrect;
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newCollectionsMap.keys()) {
        let iCustomerCollectionRowElements = _newCollectionsMap.get(iKey);
        let iTbTitle = iCustomerCollectionRowElements.tbTitle;
        const DIV_RULE_ID = iTbTitle.id + "_div_rule";
        const PARENT_ID = iTbTitle.parentElement.id;

        let iTitle = iTbTitle.value.toLowerCase().trim();
        let isCorrectOne = true;
        let divRuleElement = getOrCreateRule(DIV_RULE_ID);
        for (let jKey of _newCollectionsMap.keys()) {
            if (iKey === jKey) continue;
            let jCustomerCollectionRowElements = _newCollectionsMap.get(jKey);

            let jTitle = jCustomerCollectionRowElements.tbTitle.value.toLowerCase().trim();
            if (iTitle === jTitle) {
                isCorrectAll = false;
                isCorrectOne = false;
                divRuleElement.textContent = "Названия не могут повторяться.";
                break;
            }
        }

        changeRuleStatus(divRuleElement, PARENT_ID, isCorrectAll);
    }

    return isCorrectAll;
}

function buildABtnNewCollection() {
    let btnNewCollection = document.getElementById(_BTN_NEW_COLLECTION_ID);
    btnNewCollection.classList.add(_BTN_NEW_COLLECTION_STYLE);
}

function changeBtnNewCollectionStatus() {
    let btnNewCollection = document.getElementById(_BTN_NEW_COLLECTION_ID);
    if (btnNewCollection != null) {
        if (_newCollectionsMap.size < MAX_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            buildABtnAccept(btnNewCollection, true);
            buildABtnNewCollection();

            btnNewCollection.title = "Добавить новую коллекцию.";
            btnNewCollection.onclick = async function() {
                changeSendNewCollectionInfoRule(null, true);
                await createNewCollectionElement();
                changeBtnNewCollectionStatus();
            }
        } else {
            buildABtnDisabled(btnNewCollection);
            buildABtnNewCollection();

            btnNewCollection.title = `За раз можно добавить не более ${MAX_NUMBER_OF_NEW_COLLECTION_ITEMS} коллекций.`;
            btnNewCollection.onclick = null;
        }
    }
}

async function checkBeforeSend() {
    let isCorrect = true;
    for (let key of _newCollectionsMap.keys()) {
        let customerCollectionRowElements = _newCollectionsMap.get(key);
        let titleIsCorrect = await checkCorrectTitle(customerCollectionRowElements.tbTitle);
        let langIsCorrect = await checkCorrectLang(customerCollectionRowElements.cbLangs);

        if (isCorrect) {
            isCorrect = (titleIsCorrect && langIsCorrect);
        }
    }

    if (isCorrect) {
        isCorrect = checkAllTitles();
    }

    return isCorrect;
}

async function sendNewCollections() {
    let newCollections = [];
    for (let key of _newCollectionsMap.keys()) {
        let customerCollectionRowElements = _newCollectionsMap.get(key);

        let customerCollectionRequestDTO = new CustomerCollectionRequestDTO();
        customerCollectionRequestDTO.title = customerCollectionRowElements.tbTitle.value.trim();
        customerCollectionRequestDTO.langCode = getSelectedOptionId(customerCollectionRowElements.cbLangs.id);

        newCollections.push(customerCollectionRequestDTO);
    }

    let isCorrect = true;
    let JSONResponse = await postJSONResponseAddSeveralCollections(newCollections);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;

        let message = new CustomResponseMessage(JSONResponse.json);
        changeSendNewCollectionInfoRule(message.text, false);
    }

    return isCorrect;
}

function changeSendNewCollectionInfoRule(text, isRuleCorrect) {
    let divRuleElement = getOrCreateRule(_SEND_NEW_COLLECTIONS_INFO_ID + "_div_rule");
    divRuleElement.textContent = text;
    changeRuleStatus(divRuleElement, _SEND_NEW_COLLECTIONS_INFO_ID, isRuleCorrect);
}

