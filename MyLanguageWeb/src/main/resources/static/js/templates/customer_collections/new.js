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

class CustomerCollectionRow {
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

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ELEMENT_WITH_FLAG = new CssElementWithFlag();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _CUSTOMER_COLLECITON_UTILS = new CustomerCollectionUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

const _A_BTN_NEW_COLLECTION_STYLE_ID = "a-btn-new-collection";

const _NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID = "new-collections-container-item";
const _NEW_COLLECTION_DATA_STYLE_ID = "new-collection-data";
const _NEW_COLLECTION_DATA_ITEM_STYLE_ID = "new-collection-data-item";

const _DIV_NEW_COLLECTIONS_CONTAINER_ID = "new_collections_container";
const _A_BTN_NEW_COLLECTION_ID = "a_btn_new_collection";
const _DIV_SEND_NEW_COLLECTIONS_INFO_ID = "send_new_collections_info";
const _SUBMIT_SEND_ID = "submit_send";
const _BTN_SEND_ID = "btn_send";

const MIN_NUMBER_OF_NEW_COLLECTION_ITEMS = 1;
const MAX_NUMBER_OF_NEW_COLLECTION_ITEMS = 5;

let _indexOfNewCollectionRow = 0;
let _newCustomerCollectionRowsMap = new Map();

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function () {
    await prepareABtnNewCollection();
    prepareSubmitSend();

    await createNewCollectionRow();
}

window.onbeforeunload = async function () {

}

function prepareABtnNewCollection() {
    let aBtnNewCollection = document.getElementById(_A_BTN_NEW_COLLECTION_ID);
    if (aBtnNewCollection) {
        aBtnNewCollection.addEventListener("click", async function() {
            if (_newCustomerCollectionRowsMap.size < MAX_NUMBER_OF_NEW_COLLECTION_ITEMS) {
                clearNewCollectionsInfoContainer();
                await createNewCollectionRow();
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
async function createNewCollectionRow() {
    // Создаём поле "Название" ---
    let lbTitle = document.createElement("label");
    lbTitle.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbTitle.textContent = "Название:";

    let tbTitle = document.createElement("input");
    tbTitle.id = `tb_title_${_indexOfNewCollectionRow}`;
    tbTitle.type = "text";
    tbTitle.classList.add(_CSS_MAIN.INPUT_TEXT_STANDARD_STYLE_ID);

    let divTitle = document.createElement("div");
    divTitle.classList.add(_NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divTitle.appendChild(lbTitle);
    divTitle.appendChild(tbTitle);
    //---

    // Создаём выпадающий список "Язык" с флагом ---
    let divLangFlag = document.createElement("div");
    let divFlagContainer = document.createElement("div");
    divFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_FLAG_CONTAINER_STYLE_ID);
    divFlagContainer.appendChild(divLangFlag);

    let cbLangs = document.createElement("select");
    cbLangs.id = `cb_langs_${_indexOfNewCollectionRow}`;
    cbLangs.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);

    let divElementWithFlagContainer = document.createElement("div");
    divElementWithFlagContainer.classList.add(_CSS_ELEMENT_WITH_FLAG.DIV_ELEMENT_WITH_FLAG_CONTAINER_STYLE_ID);
    divElementWithFlagContainer.appendChild(cbLangs);
    divElementWithFlagContainer.appendChild(divFlagContainer);

    let lbLang = document.createElement("label");
    lbLang.classList.add(_CSS_MAIN.LABEL_STANDARD_STYLE_ID);
    lbLang.textContent = "Язык:";

    let divLang = document.createElement("div");
    divLang.classList.add(_NEW_COLLECTION_DATA_ITEM_STYLE_ID);
    divLang.appendChild(lbLang);
    divLang.appendChild(divElementWithFlagContainer);
    //---

    // Создаём элемент "Данные новой коллекции" ---
    let divNewCollectionData = document.createElement("div");
    divNewCollectionData.classList.add(_NEW_COLLECTION_DATA_STYLE_ID);
    divNewCollectionData.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
    divNewCollectionData.appendChild(divTitle);
    divNewCollectionData.appendChild(divLang);
    //---

    // Создаём элемент "Новая коллекция" ---
    let divNewCollection = document.createElement("div");
    divNewCollection.classList.add(_NEW_COLLECTIONS_CONTAINER_ITEM_STYLE_ID);
    divNewCollection.appendChild(divNewCollectionData);
    //---

    // Создаём кнопку "Удалить" ---
    let aBtnDelete = _A_BUTTONS.A_BUTTON_DENY.createA(_A_BUTTON_IMG_SIZES.SIZE_32);
    divNewCollection.appendChild(aBtnDelete);
    //---

    // Добавляем элементы в мапу ---
    let cbLangsWithFlag = new ComboBoxWithFlag(divLang, cbLangs, divLangFlag);

    let customerCollectionRow =
        new CustomerCollectionRow(divNewCollection, tbTitle, cbLangsWithFlag, aBtnDelete);
    _newCustomerCollectionRowsMap.set(_indexOfNewCollectionRow++, customerCollectionRow);
    //---

    // Подготавливаем поле "Название" ---
    tbTitle.addEventListener("input", async function () {
        clearNewCollectionsInfoContainer();
        await checkCorrectTitle(customerCollectionRow);
    })
    //---

    // Подготавливаем выпадающий список "Языки" ---
    let firstOption = document.createElement("option");
    firstOption.textContent = "Выберите язык";

    await _LANG_UTILS.CB_LANGS_IN.prepare(cbLangsWithFlag, firstOption, true);
    cbLangs.addEventListener("change", async function() {
        clearNewCollectionsInfoContainer();
        await checkCorrectTitle(customerCollectionRow);
    });
    //---

    // Подготавливаем кнопку "Удалить" ---
    aBtnDelete.addEventListener("click", function () {
        let isCorrect = true;
        let message;
        let ruleType;
        if (_newCustomerCollectionRowsMap.size === MIN_NUMBER_OF_NEW_COLLECTION_ITEMS) {
            isCorrect = false;
            message = `Новых коллекций должно быть не менее ${MIN_NUMBER_OF_NEW_COLLECTION_ITEMS}.`;
            ruleType = _RULE_TYPES.WARNING;
        }

        if (isCorrect === false) {
            showRuleInNewCollectionsInfoContainer(message, ruleType);
        } else {
            clearNewCollectionsInfoContainer();
            for (let key of _newCustomerCollectionRowsMap.keys()) {
                let customerCollectionRow = _newCustomerCollectionRowsMap.get(key);
                if (customerCollectionRow.divRow === divNewCollection) {
                    _newCustomerCollectionRowsMap.delete(key);
                    break;
                }
            }

            let divCollectionsContainer = document.getElementById(_DIV_NEW_COLLECTIONS_CONTAINER_ID);
            divCollectionsContainer.removeChild(divNewCollection);
        }
    });
    //---

    // Добавляем собранный элемент в контейнер ---
    let divCollectionsContainer = document.getElementById(_DIV_NEW_COLLECTIONS_CONTAINER_ID);
    if (divCollectionsContainer != null) {
        divCollectionsContainer.appendChild(divNewCollection);
    }
    //---
}

async function checkCorrectTitle(customerCollectionRow) {
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(customerCollectionRow.cbLangsWithFlag.comboBox);
    return await _CUSTOMER_COLLECITON_UTILS.TB_CUSTOMER_COLLECTION_TITLE.checkCorrectValue(
        customerCollectionRow.tbTitle, langCode, _CUSTOM_TIMER_CHECKER);
}

function checkAllTitles() {
    let isCorrectAll = true;
    for (let iKey of _newCustomerCollectionRowsMap.keys()) {
        let row = _newCustomerCollectionRowsMap.get(iKey);

        let iTbTitle = row.tbTitle;
        let iTitleValue = iTbTitle.value.toLowerCase().trim();

        let isCorrectOne = true;
        let ruleElement = new RuleElement(iTbTitle, iTbTitle.parentElement);

        for (let jKey of _newCustomerCollectionRowsMap.keys()) {
            if (iKey === jKey) continue;
            let jCustomerCollectionRow = _newCustomerCollectionRowsMap.get(jKey);

            let jTitle = jCustomerCollectionRow.tbTitle.value.toLowerCase().trim();
            if (iTitleValue === jTitle) {
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
    for (let key of _newCustomerCollectionRowsMap.keys()) {
        let row = _newCustomerCollectionRowsMap.get(key);
        let titleIsCorrect =
            await checkCorrectTitle(row);
        let langIsCorrect =
            await _LANG_UTILS.CB_LANGS_IN.checkCorrectValue(row.cbLangsWithFlag)

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

async function sendNewCollections() {
    let acceptCollectionKeys = [];
    for (let key of _newCustomerCollectionRowsMap.keys()) {
        let customerCollectionRow = _newCustomerCollectionRowsMap.get(key);
        if (customerCollectionRow) {
            let tbTitle = customerCollectionRow.tbTitle;
            let cbLangs = customerCollectionRow.cbLangsWithFlag.comboBox;
            if (tbTitle && cbLangs) {
                let dto = new CustomerCollectionRequestDTO();
                dto.title = tbTitle.value.trim();
                dto.langCode =
                    _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbLangs);

                let JSONResponse = await _CUSTOMER_COLLECTIONS_API.POST.add(dto);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    acceptCollectionKeys.push(key);
                }
            }
        }
    }

    let isCorrect = true;
    let message;
    let ruleType;
    if (acceptCollectionKeys.length !== _newCustomerCollectionRowsMap.size) {
        isCorrect = false;
        message = "Произошла ошибка при попытке создания некоторых коллекций. Попробуйте ещё раз.";
        ruleType = _RULE_TYPES.ERROR;
    }

    if (isCorrect === false) {
        for (let i = 0; i < acceptCollectionKeys.length; i++) {
            let customerCollectionRow = _newCustomerCollectionRowsMap.get(acceptCollectionKeys[i]);
            if (customerCollectionRow) {
                let divRow = customerCollectionRow.divRow;

                divRow.parentNode.removeChild(divRow);
                _newCustomerCollectionRowsMap.delete(acceptCollectionKeys[i]);
            }
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
        clearNewCollectionsInfoContainer();

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
            aBtnNewWord.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);
            aBtnNewWord.classList.add(_A_BTN_NEW_COLLECTION_STYLE_ID);
        } else {
            aBtnNewWord.className = "";
            aBtnNewWord.classList.add(_CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID);
            aBtnNewWord.classList.add(_A_BTN_NEW_COLLECTION_STYLE_ID);
        }
    }
    //---

    // Элементы каждой новой коллекции ---
    for (let key of _newCustomerCollectionRowsMap.keys()) {
        let row = _newCustomerCollectionRowsMap.get(key);
        if (row) {
            row.tbTitle.disabled = isDisable;

            let cbLangsWithFlag = row.cbLangsWithFlag;
            if (cbLangsWithFlag) {
                cbLangsWithFlag.comboBox.disabled = isDisable;
            }

            let aBtnDelete = row.aBtnDelete;
            if (aBtnDelete) {
                let aButtonImgSize = _A_BUTTON_IMG_SIZES.SIZE_32;
                if (isDisable === true) {
                    _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnDelete, aButtonImgSize);
                } else {
                    _A_BUTTONS.A_BUTTON_DENY.setStyles(aBtnDelete, aButtonImgSize);
                }
            }
        }
    }
    //---
}
//---
