import {
    CustomTimer
} from "../../classes/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CustomerCollectionRequestDTO
} from "../../classes/dto/customer_collection.js";

import {
    RuleElement,
    RuleTypes
} from "../../classes/rule_element.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

import {
    AButtons
} from "../../classes/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    CssElementWithFlag
} from "../../classes/css/css_element_with_flag.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

class CustomerCollectionRowElements {
    divRow;
    tbTitleParent;
    tbTitle;
    cbLangsParent;
    cbLangs;

    constructor(divRow, tbTitleParent, tbTitle, cbLangsParent, cbLangs) {
        this.divRow = divRow;
        this.tbTitleParent = tbTitleParent;
        this.tbTitle = tbTitle;
        this.cbLangsParent = cbLangsParent;
        this.cbLangs = cbLangs;
    }
}

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ELEMENT_WITH_FLAG = new CssElementWithFlag();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _CUSTOMER_COLLECITON_UTILS = new CustomerCollectionUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

const NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID = "new-collections-container-item";
const NEW_COLLECTION_DATA_STYLE_ID = "new-collection-data";
const NEW_COLLECTION_DATA_ITEM_STYLE_ID = "new-collection-data-item";

const _NEW_COLLECTIONS_CONTAINER_ID = "new_collections_container";
const _BTN_NEW_COLLECTION_ID = "btn_new_collection";
const _DIV_SEND_NEW_COLLECTIONS_INFO_ID = "send_new_collections_info";
const _SUBMIT_SEND_ID = "submit_send";
const _SUBMIT_BTN_ID = "submit_btn";

const _BTN_NEW_COLLECTION_STYLE = "btn-new-collection";

const MIN_NUMBER_OF_NEW_COLLECTION_ITEMS = 1;
const MAX_NUMBER_OF_NEW_COLLECTION_ITEMS = 5;

let _indexOfNewCollection = 0;
let _newCollectionsMap = new Map();

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

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

        // Показываем анимацию загрузки (предварительно очистив информацию в контейнере) ---
        let divSendNewCollectionsInfo = document.getElementById(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
        divSendNewCollectionsInfo.replaceChildren();

        let divLoading = new LoadingElement().createDiv();
        divLoading.style.justifyContent = "left";
        divSendNewCollectionsInfo.appendChild(divLoading);
        //---

        if (await checkBeforeSend() === true) {
            if (await sendNewCollections() === true) {
                submitSend.submit();
            }
        } else {
            divSendNewCollectionsInfo.removeChild(divLoading);
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

    let divTitle = document.createElement("div");
    divTitle.id = "div_title" + "_" + _indexOfNewCollection;
    divTitle.classList.add(NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divTitle.appendChild(lbTitle);
    divTitle.appendChild(tbTitle);
    //---

    // Создаём выпадающий список "Язык" с флагом ---
    let divLangFlag = document.createElement("div");
    let divFlagContainer = document.createElement("div");
    divFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_FLAG_CONTAINER_STYLE_ID);
    divFlagContainer.appendChild(divLangFlag);

    let cbLangs = document.createElement("select");
    cbLangs.id = "cb_langs" + "_" + _indexOfNewCollection;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let firstOption = document.createElement("option");
    firstOption.textContent = "Все";
    await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

    let divElementWithFlagContainer = document.createElement("div");
    divElementWithFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_ELEMENT_WITH_FLAG_CONTAINER_STYLE_ID);
    divElementWithFlagContainer.appendChild(cbLangs);
    divElementWithFlagContainer.appendChild(divFlagContainer);
    //---

    // Создаём выпадающий список "Язык" ---
    let lbLang = document.createElement("label");
    lbLang.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbLang.textContent = "Язык:";

    let divLang = document.createElement("div");
    divLang.id = "div_lang" + "_" + _indexOfNewCollection;
    divLang.classList.add(NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(divElementWithFlagContainer);
    //---

    // Вешаем события на элементы ---
    tbTitle.addEventListener("input", async function () {
        changeSendNewCollectionInfoRule(true, null, null);
        await checkCorrectTitle(this, divTitle);
    })


    cbLangs.addEventListener("change", async function() {
        changeSendNewCollectionInfoRule(true, null, null)
        await checkCorrectLang(this, divLang);
    });
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
    let aDeleteButton = _A_BUTTONS.A_BUTTON_DENY.createA();
    aDeleteButton.addEventListener("click", function () {
        let isCorrect = true;
        let message;
        let ruleType;
        if (_newCollectionsMap.size === MIN_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            isCorrect = false;
            message = `Новых коллекций должно быть не менее ${MIN_NUMBER_OF_NEW_COLLECTION_ITEMS}.`;
            ruleType = _RULE_TYPES.WARNING;
        }

        if (isCorrect === false) {
            changeSendNewCollectionInfoRule(isCorrect, message, ruleType);
        } else {
            changeSendNewCollectionInfoRule(isCorrect, null, null);
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
        new CustomerCollectionRowElements(divNewCollection, divTitle, tbTitle, divLang, cbLangs);
    _newCollectionsMap.set(_indexOfNewCollection++, customerCollectionRowElements);
    //---
}

async function checkCorrectTitle(tbTitle, parentElement) {
    return await _CUSTOMER_COLLECITON_UTILS
        .checkCorrectValueInTbTitle(tbTitle, parentElement, _CUSTOM_TIMER_CHECKER);
}

async function checkCorrectLang(cbLangs, parentElement) {
    return await _LANG_UTILS.checkCorrectValueInComboBox(cbLangs, parentElement, true);
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newCollectionsMap.keys()) {
        let iCustomerCollectionRowElements = _newCollectionsMap.get(iKey);

        let iTitle = iCustomerCollectionRowElements.tbTitle.value.toLowerCase().trim();

        let isCorrectOne = true;
        let message;
        let ruleType;

        for (let jKey of _newCollectionsMap.keys()) {
            if (iKey === jKey) continue;
            let jCustomerCollectionRowElements = _newCollectionsMap.get(jKey);

            let jTitle = jCustomerCollectionRowElements.tbTitle.value.toLowerCase().trim();
            if (iTitle === jTitle) {
                isCorrectAll = false;
                isCorrectOne = false;

                message = "Названия не могут повторяться.";
                ruleType = _RULE_TYPES.ERROR;
                break;
            }
        }

        // Отображаем предупреждение (правило), если это необходимо ---
        let ruleElement = new RuleElement(iCustomerCollectionRowElements.tbTitle.parentNode.id);
        if (isCorrectOne === false) {
            ruleElement.createOrChangeDiv(message, ruleType);
        } else {
            ruleElement.removeDiv();
        }
        //---
    }

    return isCorrectAll;
}

function buildABtnNewCollection() {
    let btnNewCollection = document.getElementById(_BTN_NEW_COLLECTION_ID);
    btnNewCollection.classList.add(_BTN_NEW_COLLECTION_STYLE);
}

function changeBtnNewCollectionStatus() {
    let aBtnNewCollection = document.getElementById(_BTN_NEW_COLLECTION_ID);
    if (aBtnNewCollection != null) {
        if (_newCollectionsMap.size < MAX_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            _A_BUTTONS.A_BUTTON_ACCEPT.setStyles(aBtnNewCollection, true);
            buildABtnNewCollection();

            aBtnNewCollection.title = "Добавить новую коллекцию.";
            aBtnNewCollection.onclick = async function() {
                changeSendNewCollectionInfoRule(true, null, null);
                await createNewCollectionElement();
                changeBtnNewCollectionStatus();
            }
        } else {
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnNewCollection);
            buildABtnNewCollection();

            aBtnNewCollection.title = `За раз можно добавить не более ${MAX_NUMBER_OF_NEW_COLLECTION_ITEMS} коллекций.`;
            aBtnNewCollection.onclick = null;
        }
    }
}

async function checkBeforeSend() {
    let isCorrect = true;
    for (let key of _newCollectionsMap.keys()) {
        let customerCollectionRowElements = _newCollectionsMap.get(key);
        let titleIsCorrect =
            await checkCorrectTitle(customerCollectionRowElements.tbTitle, customerCollectionRowElements.tbTitleParent);
        let langIsCorrect =
            await checkCorrectLang(customerCollectionRowElements.cbLangs, customerCollectionRowElements.cbLangsParent);

        if (isCorrect === true) {
            isCorrect = (titleIsCorrect && langIsCorrect);
        }
    }

    if (isCorrect === true) {
        isCorrect = checkAllTitles();
    }

    return isCorrect;
}

async function sendNewCollections() {
    let acceptCollectionKeys = [];
    for (let key of _newCollectionsMap.keys()) {
        let customerCollectionRowElements = _newCollectionsMap.get(key);

        let customerCollectionRequestDTO = new CustomerCollectionRequestDTO();
        customerCollectionRequestDTO.title = customerCollectionRowElements.tbTitle.value.trim();
        customerCollectionRequestDTO.langCode =
            _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(customerCollectionRowElements.cbLangs);


        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.POST.add(customerCollectionRequestDTO);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            acceptCollectionKeys.push(key);
        }
    }

    let isCorrect = true;
    let message;
    let ruleType;
    if (acceptCollectionKeys.length !== _newCollectionsMap.size) {
        isCorrect = false;
        message = "Произошла ошибка при попытке создания некоторых коллекций. Попробуйте ещё раз.";
        ruleType = _RULE_TYPES.ERROR;

        for (let i = 0; i < acceptCollectionKeys.length; i++) {
            let key = acceptCollectionKeys[i];
            let divRow = _newCollectionsMap.get(key).divRow;
            divRow.parentNode.removeChild(divRow);

            _newCollectionsMap.delete(acceptCollectionKeys[i]);
        }
    }

    if (isCorrect === false) {
        changeSendNewCollectionInfoRule(isCorrect, message, ruleType);
    }

    return isCorrect;
}

function changeSendNewCollectionInfoRule(isCorrect, message, ruleType) {
    let divSendNewWordsInfo = document.getElementById(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
    divSendNewWordsInfo.replaceChildren();

    let ruleElement = new RuleElement(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
    if (isCorrect === false) {
        ruleElement.createOrChangeDiv(message, ruleType);
    } else {
        ruleElement.removeDiv();
    }
}

