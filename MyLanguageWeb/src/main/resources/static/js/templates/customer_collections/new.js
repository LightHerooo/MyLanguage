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
    CustomerCollectionRequestDTO
} from "../../classes/dto/entity/customer_collection.js";

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
} from "../../classes/css/other/css_element_with_flag.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

class CustomerCollectionRowElements {
    divRow;
    tbTitleParent;
    tbTitle;
    cbLangsParent;
    cbLangs;
    aBtnDelete;

    constructor(divRow, tbTitleParent, tbTitle, cbLangsParent, cbLangs, aBtnDelete) {
        this.divRow = divRow;
        this.tbTitleParent = tbTitleParent;
        this.tbTitle = tbTitle;
        this.cbLangsParent = cbLangsParent;
        this.cbLangs = cbLangs;
        this.aBtnDelete = aBtnDelete;
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

const _A_BTN_NEW_COLLECTION_STYLE_ID = "a-btn-new-collection";

const NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID = "new-collections-container-item";
const NEW_COLLECTION_DATA_STYLE_ID = "new-collection-data";
const NEW_COLLECTION_DATA_ITEM_STYLE_ID = "new-collection-data-item";

const _NEW_COLLECTIONS_CONTAINER_ID = "new_collections_container";
const _A_BTN_NEW_COLLECTION_ID = "a_btn_new_collection";
const _DIV_SEND_NEW_COLLECTIONS_INFO_ID = "send_new_collections_info";
const _SUBMIT_SEND_ID = "submit_send";
const _BTN_SEND_ID = "btn_send";

const MIN_NUMBER_OF_NEW_COLLECTION_ITEMS = 1;
const MAX_NUMBER_OF_NEW_COLLECTION_ITEMS = 5;

let _indexOfNewCollection = 0;
let _newCollectionsMap = new Map();

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function () {
    await prepareABtnNewCollection();
    prepareSubmitSend();

    await createNewCollectionElement();
}

window.onbeforeunload = async function () {

}

function prepareABtnNewCollection() {
    let btnNewCollection = document.getElementById(_A_BTN_NEW_COLLECTION_ID);
    if (btnNewCollection) {
        btnNewCollection.addEventListener("click", async function() {
            if (_newCollectionsMap.size < MAX_NUMBER_OF_NEW_COLLECTION_ITEMS) {
                clearNewCollectionsInfoContainer();
                await createNewCollectionElement();
            } else {
                let message = `За раз можно создать не более ${MAX_NUMBER_OF_NEW_COLLECTION_ITEMS} коллекций.`;
                let ruleType = _RULE_TYPES.WARNING;
                showRuleInNewCollectionsInfoContainer(message, ruleType);
            }
        });
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    submitSend.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Блокируем элементы и показываем загрузку ---
        changeDisableStatusInImportantElements(true);

        clearNewCollectionsInfoContainer();
        let divSendNewCollectionsInfo = document.getElementById(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
        if (divSendNewCollectionsInfo) {
            let divLoading = new LoadingElement().createDiv();
            divLoading.style.justifyContent = "left";
            divSendNewCollectionsInfo.appendChild(divLoading);
        }
        //---

        if (await checkBeforeSend() === true) {
            if (await sendNewCollections() === true) {
                window.onbeforeunload = null;
                submitSend.submit();
            } else {
                changeDisableStatusInImportantElements(false);
            }
        } else {
            clearNewCollectionsInfoContainer();
            changeDisableStatusInImportantElements(false);
        }
    })
}

// Создание новых коллекций ---
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
        clearNewCollectionsInfoContainer();
        await checkCorrectTitle(this, cbLangs, divTitle);
    })


    cbLangs.addEventListener("change", async function() {
        clearNewCollectionsInfoContainer();
        await checkCorrectLang(this, divLang);
        await checkCorrectTitle(tbTitle, this, divTitle);
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
    let aBtnDelete = _A_BUTTONS.A_BUTTON_DENY.createA();
    aBtnDelete.addEventListener("click", function () {
        let isCorrect = true;
        let message;
        let ruleType;
        if (_newCollectionsMap.size === MIN_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            isCorrect = false;
            message = `Новых коллекций должно быть не менее ${MIN_NUMBER_OF_NEW_COLLECTION_ITEMS}.`;
            ruleType = _RULE_TYPES.WARNING;
        }

        if (isCorrect === false) {
            showRuleInNewCollectionsInfoContainer(message, ruleType);
        } else {
            clearNewCollectionsInfoContainer();
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
        }
    });

    divNewCollection.appendChild(divNewCollectionData);
    divNewCollection.appendChild(aBtnDelete);
    //---

    // Добавляем собранный элемент в контейнер ---
    let divCollectionsContainer = document.getElementById(_NEW_COLLECTIONS_CONTAINER_ID);
    if (divCollectionsContainer != null) {
        divCollectionsContainer.appendChild(divNewCollection);
    }
    //---

    // Добавляем элементы ввода в Map ---
    let customerCollectionRowElements =
        new CustomerCollectionRowElements(divNewCollection, divTitle, tbTitle, divLang, cbLangs, aBtnDelete);
    _newCollectionsMap.set(_indexOfNewCollection++, customerCollectionRowElements);
    //---
}

async function checkCorrectTitle(tbTitle, cbLangs, parentElement) {
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbLangs);
    return await _CUSTOMER_COLLECITON_UTILS
        .checkCorrectValueInTbTitle(tbTitle, parentElement, langCode, _CUSTOM_TIMER_CHECKER);
}

async function checkCorrectLang(cbLangs, parentElement) {
    return await _LANG_UTILS.checkCorrectValueInComboBox(cbLangs, parentElement);
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newCollectionsMap.keys()) {
        let row = _newCollectionsMap.get(iKey);

        let iTbTitle = row.tbTitle;
        let iTitle = iTbTitle.value.toLowerCase().trim();

        let isCorrectOne = true;
        let ruleElement = new RuleElement(iTbTitle, iTbTitle.parentElement);

        for (let jKey of _newCollectionsMap.keys()) {
            if (iKey === jKey) continue;
            let jCustomerCollectionRowElements = _newCollectionsMap.get(jKey);

            let jTitle = jCustomerCollectionRowElements.tbTitle.value.toLowerCase().trim();
            if (iTitle === jTitle) {
                isCorrectAll = false;
                isCorrectOne = false;

                ruleElement.message = "Названия не могут повторяться.";
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
    for (let key of _newCollectionsMap.keys()) {
        let row = _newCollectionsMap.get(key);
        let titleIsCorrect =
            await checkCorrectTitle(row.tbTitle, row.cbLangs, row.tbTitleParent);
        let langIsCorrect =
            await checkCorrectLang(row.cbLangs, row.cbLangsParent);

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
        showRuleInNewCollectionsInfoContainer(message, ruleType);
    }

    return isCorrect;
}

function clearNewCollectionsInfoContainer() {
    let divNewCollectionsInfo = document.getElementById(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
    if (divNewCollectionsInfo) {
        divNewCollectionsInfo.replaceChildren();
    }
}

function showRuleInNewCollectionsInfoContainer(message, ruleType) {
    let divSendNewWordsInfo = document.getElementById(_DIV_SEND_NEW_COLLECTIONS_INFO_ID);
    if (divSendNewWordsInfo) {
        let ruleElement = new RuleElement(divSendNewWordsInfo, divSendNewWordsInfo);
        ruleElement.message = message;
        ruleElement.ruleType = ruleType;
        ruleElement.showRule();
    }
}

function changeDisableStatusInImportantElements(isDisable) {
    let btnSend = document.getElementById(_BTN_SEND_ID);
    if (btnSend) {
        btnSend.disabled = isDisable;
    }

    // Кнопка "Добавить новое слово" ---
    let aBtnNewWord = document.getElementById(_A_BTN_NEW_COLLECTION_ID);
    if (aBtnNewWord) {
        if (isDisable === true) {
            aBtnNewWord.className = "";
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnNewWord);
            aBtnNewWord.classList.add(_A_BTN_NEW_COLLECTION_STYLE_ID);
        } else {
            aBtnNewWord.className = "";
            aBtnNewWord.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
            aBtnNewWord.classList.add(_A_BTN_NEW_COLLECTION_STYLE_ID);
        }
    }
    //---

    // Элементы каждой новой коллекции ---
    for (let key of _newCollectionsMap.keys()) {
        let row = _newCollectionsMap.get(key);
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
