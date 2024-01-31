import {
    CustomTimer
} from "../../classes/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WordInCollectionResponseDTO
} from "../../classes/dto/word_in_collection.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    CustomerCollectionRequestDTO,
    CustomerCollectionResponseDTO
} from "../../classes/dto/customer_collection.js";

import {
    RuleTypes,
    RuleElement
} from "../../classes/rule_element.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    PartOfSpeechUtils
} from "../../classes/utils/entity/part_of_speech_utils.js";

import {
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

import {
    WordsInCollectionAPI
} from "../../classes/api/words_in_collection_api.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    CssCollectionInfo
} from "../../classes/css/css_collection_info.js";

import {
    CustomTimerUtils
} from "../../classes/utils/custom_timer_utils.js";

import {
    FlagElements
} from "../../classes/flag_elements.js";

const _CSS_COLLECTION_INFO = new CssCollectionInfo();

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _LANG_UTILS = new LangUtils();
const _PART_OF_SPEECH_UTILS = new PartOfSpeechUtils();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _TABLE_UTILS = new TableUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _CUSTOM_TIMER_UTILS = new CustomTimerUtils();
const _FLAG_ELEMENTS = new FlagElements();

const _TB_TITLE_ID = "tb_title";
const _DIV_KEY_CONTAINER = "tb_key_container";
const _TB_KEY_ID = "tb_key";
const _SUBMIT_SEND_ID = "submit_send";
const _BTN_SEND = "btn_send";
const _DIV_SEND_NEW_COLLECTION_BY_KEY_INFO_ID = "send_new_collection_by_key_info";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _COLLECTION_WORD_TABLE_HEAD_ID = "collection_word_table_head";
const _COLLECTION_WORD_TABLE_BODY_ID = "collection_word_table_body";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_COLLECTION_FLAG_ID = "collection_flag";
const _DIV_LANG_FLAG_ID = "lang_flag";

const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_COLLECTION_INFO_WAITER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();
let _accessToFillCollectionInfo = true;

const _CUSTOM_TIMER_TABLE_WAITER = new CustomTimer();
const _CUSTOM_TIMER_TABLE_FINDER = new CustomTimer();
let _accessToFillTable = true;

const _CUSTOM_TIMER_CHECKER = new CustomTimer();

window.onload = async function () {
    prepareCollectionInfoTimers();
    prepareTableTimers();

    await prepareCbLangs();
    await prepareCbPartsOfSpeech();
    prepareTbFinder();
    prepareBtnRefresh();

    prepareTbTitle();
    prepareTbKey();
    prepareSubmitSend();

    startTimers();
}

function startTimers() {
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_COLLECTION_INFO_WAITER, _CUSTOM_TIMER_COLLECTION_INFO_FINDER);
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_TABLE_WAITER, _CUSTOM_TIMER_TABLE_FINDER);
}

function prepareCollectionInfoTimers() {
    _CUSTOM_TIMER_COLLECTION_INFO_WAITER.handler = function () {
        _accessToFillCollectionInfo = false;

        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.handler = async function () {
        _accessToFillCollectionInfo = true;
        await tryToFillCollectionInfo();
    }
}

function prepareTableTimers() {
    _CUSTOM_TIMER_TABLE_WAITER.handler = function () {
        _accessToFillTable = false;

        // Отображаем загрузку в таблице ---
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
        //---

        // Отображаем загрузку в блоке с информацией о коллекции ---
        let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfoContainer.replaceChildren();
        divCollectionInfoContainer.appendChild(new LoadingElement().createDiv());
        //---
    }

    _CUSTOM_TIMER_TABLE_FINDER.handler = async function() {
        _accessToFillTable = true;
        await tryToFillTable();
    }
}

function prepareTbTitle() {
    let tbTitle = document.getElementById(_TB_TITLE_ID);
    if (tbTitle) {
        tbTitle.addEventListener("input", async function() {
            setInfoRuleMessage(true, null, null);

            await checkCorrectTitle();
        });
    }
}

function prepareTbKey() {
    let tbKey = document.getElementById(_TB_KEY_ID);
    if (tbKey) {
        let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
        _CUSTOMER_COLLECTION_UTILS.prepareTextBox(tbKey, divCollectionFlag);

        let customTimerLangFlagChanger = new CustomTimer();
        customTimerLangFlagChanger.timeout = 250;
        customTimerLangFlagChanger.handler = async function () {
            // Ищем по ключу коллекцию и получаем из неё язык ---
            let langCode;
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(tbKey.value);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
                langCode = customerCollection.lang.code;
            }
            //---

            // Меняем язык в списке языков + его флаг ---
            let cbLangs = document.getElementById(_CB_LANGS_ID);
            cbLangs.removeEventListener("change", startTimers);
            _LANG_UTILS.changeCbLangsItemByLangCode(cbLangs, langCode, true);
            cbLangs.addEventListener("change", startTimers);
            //---
        }

        tbKey.addEventListener("input", async function() {
            setInfoRuleMessage(true, null, null);

            customTimerLangFlagChanger.start();
            startTimers();
            await checkCorrectKey();
        });
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let btnSend = document.getElementById(_BTN_SEND);
    if (submitSend != null) {
        submitSend.addEventListener("submit", async function(event) {
            btnSend.disabled = true;
            event.preventDefault();

            if (await checkBeforeSend() === true
                && await sendNewCollectionByKey() === true) {
                submitSend.submit();
            }

            btnSend.disabled = false;
        });
    }
}

async function checkCorrectTitle() {
    let tbTitle = document.getElementById(_TB_TITLE_ID);
    return await _CUSTOMER_COLLECTION_UTILS
        .checkCorrectValueInTbTitle(tbTitle, tbTitle.parentElement, _CUSTOM_TIMER_CHECKER);
}

async function checkCorrectKey() {
    let tbKey = document.getElementById(_TB_KEY_ID);
    let tbKeyParent = document.getElementById(_DIV_KEY_CONTAINER);
    return await _CUSTOMER_COLLECTION_UTILS
        .checkCorrectValueInTbKey(tbKey, tbKeyParent, _CUSTOM_TIMER_CHECKER);
}

async function tryToFillCollectionInfo() {
    let collectionKey = document.getElementById(_TB_KEY_ID).value;

    let divCollectionInfo;
    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
        divCollectionInfo = await customerCollection.createDivInfo();
    } else {
        divCollectionInfo = document.createElement("div");
        divCollectionInfo.classList.add(_CSS_COLLECTION_INFO.DIV_COLLECTION_INFO_ERROR_CONTAINER_STYLE_ID);
        divCollectionInfo.textContent = "Введите корректный ключ коллекции, чтобы увидеть информацию о ней.";
    }

    let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (_accessToFillCollectionInfo === true) {
        divCollectionInfoContainer.replaceChildren();
        if (_accessToFillCollectionInfo === true) {
            divCollectionInfoContainer.appendChild(divCollectionInfo);
        }
    }
}

async function checkBeforeSend() {
    let isKeyCorrect = await checkCorrectKey();
    let isTitleCorrect = await checkCorrectTitle();

    return isKeyCorrect && isTitleCorrect;
}

async function sendNewCollectionByKey() {
    let isCorrect = true;
    let message;
    let ruleType;

    let customerCollectionRequestDTO = new CustomerCollectionRequestDTO();
    customerCollectionRequestDTO.title = document.getElementById(_TB_TITLE_ID).value;
    customerCollectionRequestDTO.key = document.getElementById(_TB_KEY_ID).value;

    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.POST.copyByKey(customerCollectionRequestDTO);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        message = new CustomResponseMessage(JSONResponse.json).text;
        ruleType = _RULE_TYPES.ERROR;
    }

    if (isCorrect === false) {
        setInfoRuleMessage(isCorrect, message, ruleType);
    } else {
        setInfoRuleMessage(isCorrect, null, null);
    }

    return isCorrect;
}

function setInfoRuleMessage(isCorrect, message, ruleType) {
    let ruleElement = new RuleElement(_DIV_SEND_NEW_COLLECTION_BY_KEY_INFO_ID);

    // Отображаем предупреждение (правило), если это необходимо ---
    if (isCorrect === false) {
        ruleElement.createOrChangeDiv(message, ruleType);
    } else {
        ruleElement.removeDiv();
    }
    //---
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        tbFinder.addEventListener("input", async function () {
            startTimers();
        });
    }
}

async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
        await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

        cbLangs.addEventListener("change", startTimers);
    }
}

async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
        _FLAG_ELEMENTS.DIV.setStyles(divLangFlag, null, true);
        await _PART_OF_SPEECH_UTILS.fillComboBox(cbPartsOfSpeech, firstOption, divLangFlag);

        cbPartsOfSpeech.addEventListener("change", function () {
            startTimers();
        });
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            startTimers();
        })
    }
}

async function sendPrepareRequest() {
    let collectionKey = document.getElementById(_TB_KEY_ID).value;
    let title = document.getElementById(_TB_FINDER_ID).value;
    let partOfSpeechCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_PARTS_OF_SPEECH_ID);
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);

    return await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(collectionKey,
        _NUMBER_OF_WORDS, title, partOfSpeechCode, langCode, BigInt(_lastWordInCollectionIdOnPreviousPage));
}

async function tryToFillTable() {
    let readyToFill = true;
    let collectionKey = document.getElementById(_TB_KEY_ID).value;
    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        readyToFill = false;
        setMessageInsideTable("Введите корректный ключ коллекции, чтобы увидеть слова, находящиеся в ней.");
    }

    if (readyToFill === true) {
        _lastWordNumberInList = 0;
        _lastWordInCollectionIdOnPreviousPage = 0n;

        // Ищем слова в коллекции ---
        JSONResponse = await sendPrepareRequest();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = await createTableRows(JSONResponse.json);
            if (_accessToFillTable === true) {
                let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
                tableBody.replaceChildren();
                for (let i = 0; i < tableRows.length; i++) {
                    if (_accessToFillTable === true) {
                        tableBody.appendChild(tableRows[i]);
                    }
                }
            }
        } else {
            setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
        }
    }
}

async function createTableRows(allWordsInCollectionFilteredPaginationJson) {
    let tableRows = [];

    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        if (_accessToFillTable === true) {
            let wordInCollection =
                new WordInCollectionResponseDTO(allWordsInCollectionFilteredPaginationJson[i]);

            let row = await createTableRow(wordInCollection);
            if (row) {
                tableRows.push(row);
            }

            // Получаем id последнего элемента JSON-коллекции
            if (i === allWordsInCollectionFilteredPaginationJson.length - 1) {
                _lastWordInCollectionIdOnPreviousPage = wordInCollection.id;
            }
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (_accessToFillTable === true && allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function () {
                let JSONResponse = await sendPrepareRequest();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
                    let tableRows = await createTableRows(JSONResponse.json);
                    for (let i = 0; i < tableRows.length; i++) {
                        if (_accessToFillTable === true) {
                            tableBody.appendChild(tableRows[i]);
                        }
                    }
                }
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createTableRow(wordInCollectionResponseDTO) {
    let row = document.createElement("tr");

    // Порядковый номер строки ---
    let numberColumn = document.createElement("td");
    numberColumn.style.textAlign = "center";
    numberColumn.textContent = `${++_lastWordNumberInList}.`;
    row.appendChild(numberColumn);
    //---

    // Название слова ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordInCollectionResponseDTO.word.title;
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    langColumn.appendChild(wordInCollectionResponseDTO.word.lang.createSpan());
    row.appendChild(langColumn);
    //---

    // Часть речи ---
    let partOfSpeechColumn = document.createElement("td");
    partOfSpeechColumn.appendChild(wordInCollectionResponseDTO.word.partOfSpeech.createDiv());
    row.appendChild(partOfSpeechColumn);
    //---

    return row;
}

function setMessageInsideTable(message) {
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
    let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE
        .createTrCommon(numberOfColumns, message);

    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (_accessToFillTable === true) {
        tableBody.replaceChildren();
        if (_accessToFillTable === true) {
            tableBody.appendChild(trMessage);
        }
    }
}