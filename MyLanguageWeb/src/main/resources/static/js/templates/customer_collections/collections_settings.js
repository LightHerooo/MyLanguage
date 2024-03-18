import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    ComboBoxWithFlag
} from "../../classes/element_with_flag/combo_box_with_flag.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    AButtons
} from "../../classes/a_buttons/a_buttons.js";

import {
    AButtonImgSizes
} from "../../classes/a_buttons/a_button_img_sizes.js";

import {
    CustomerCollectionRequestDTO,
    CustomerCollectionResponseDTO
} from "../../classes/dto/entity/customer_collection.js";

import {
    WordsInCollectionAPI
} from "../../classes/api/words_in_collection_api.js";

import {
    WordInCollectionResponseDTO
} from "../../classes/dto/entity/word_in_collection.js";

class WordsInCollectionItemsForFind {
    table;
    tHead;
    tBody;
    customTimerFinder;
    numberOfItems = 20;
    lastWordInCollectionNumberInList = 0;
    lastWordInCollectionIdOnPreviousPage = 0n;

    constructor(table, tHead, tBody, customTimerFinder) {
        this.table = table;
        this.tHead = tHead;
        this.tBody = tBody;
        this.customTimerFinder = customTimerFinder;
    }
}

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_MAIN = new CssMain();

const _TEXT_BOX_UTILS = new TextBoxUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _LANG_UTILS = new LangUtils();
const _TABLE_UTILS = new TableUtils();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _GLOBAL_COOKIES = new GlobalCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _A_BUTTONS = new AButtons();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

const _DIV_COLLECTIONS_STATISTICS_CONTAINER_ID = "collections_statistics_container";
const _TB_FINDER_ID = "tb_finder";

const _CB_LANGS_ID = "cb_langs";
const _DIV_LANG_FLAG_ID = "lang_flag";

const _CB_IS_ACTIVE_ID = "cb_is_active";
const _BTN_REFRESH_ID = "btn_refresh";
const _COLGROUP_COLLECTIONS_ID = "colgroup_collections";
const _THEAD_COLLECTIONS_ID = "thead_collections";
const _TBODY_COLLECTIONS_ID = "tbody_collections";

const _NUMBER_OF_ITEMS = 10;
let _lastCollectionNumberInList = 0;
let _lastCollectionIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTIONS_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _CUSTOM_TIMER_FOR_TB_FINDER = new CustomTimer();
const _CUSTOM_TIMER_FOR_REFRESH = new CustomTimer();

let _wordsInCollectionItemsForFindMap = new Map();

window.onload = async function() {
    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareCollectionsFinder();
    //---

    prepareTbFinder();
    await prepareCbLangs();
    prepareCbIsActive();
    prepareBtnRefresh();

    // Запускаем таймеры ---
    startAllFinders();
    //---
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startAllFinders, _CUSTOM_TIMER_FOR_TB_FINDER);
    }
}

async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
    if (cbLangs && divLangFlag) {
        let cbLangsWithFlag = new ComboBoxWithFlag(cbLangs.parentElement, cbLangs, divLangFlag);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _LANG_UTILS.CB_LANGS_IN.prepare(cbLangsWithFlag, firstOption, false);

        cbLangs.addEventListener("change", startAllFinders);
    }
}

function prepareCbIsActive() {
    let cbIsActive = document.getElementById(_CB_IS_ACTIVE_ID);
    if (cbIsActive) {
        _COMBO_BOX_UTILS.prepareCbBoolean(cbIsActive);
        _COMBO_BOX_UTILS.callChangeEvent(cbIsActive);

        cbIsActive.addEventListener("change", startAllFinders);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", async function() {
            changeDisableStatusToFinderInstruments(true);

            // Отображаем загрузки ---
            showLoadingInStatistic();
            showLoadingInCollectionsTable();
            //---

            let refreshPromise = new Promise(resolve => {
                _CUSTOM_TIMER_FOR_REFRESH.stop();

                _CUSTOM_TIMER_FOR_REFRESH.setTimeout(500);
                _CUSTOM_TIMER_FOR_REFRESH.setHandler(async function() {
                    let cbLangs = document.getElementById(_CB_LANGS_ID);
                    let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
                    if (cbLangs && divLangFlag) {
                        let cbLangsWithFlag =
                            new ComboBoxWithFlag(cbLangs.parentElement, cbLangs, divLangFlag);

                        let firstOption = document.createElement("option");
                        firstOption.textContent = "Все";

                        await _LANG_UTILS.CB_LANGS_IN.fill(cbLangsWithFlag, firstOption);
                    }

                    resolve();
                });

                _CUSTOM_TIMER_FOR_REFRESH.start();
            });
            await refreshPromise;

            startAllFinders();
            changeDisableStatusToFinderInstruments(false);
        })
    }

}

function startAllFinders() {
    startToFindStatistic();
    startToFindCollections();
}

function changeDisableStatusToFinderInstruments(isDisable) {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.disabled = isDisable;
    }

    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        tbFinder.disabled = isDisable;
    }

    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs) {
        cbLangs.disabled = isDisable;
    }

    let cbIsActive = document.getElementById(_CB_IS_ACTIVE_ID);
    if (cbIsActive) {
        cbIsActive.disabled = isDisable;
    }
}

// Статистика ---
function showLoadingInStatistic() {
    let divStatistics = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
    if (divStatistics) {
        divStatistics.replaceChildren();
        divStatistics.className = "";
        divStatistics.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        divStatistics.appendChild(new LoadingElement().createDiv());
    }
}

function prepareStatisticFinder() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    if (currentFinder) {
        currentFinder.setTimeout(_TIMEOUT_FOR_FINDERS);
        currentFinder.setHandler(async function() {
            await tryToFillStatistic();
        })
    }
}

function startToFindStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    if (currentFinder) {
        currentFinder.stop();
    }

    showLoadingInStatistic();

    if (currentFinder) {
        currentFinder.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    let divCollectionsStatisticsContainer =
        document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
    if (divCollectionsStatisticsContainer) {
        let divStatistic = await _CUSTOMER_COLLECTION_UTILS.createDivStatistic();
        if (divStatistic && currentFinder.getActive() === true) {
            divCollectionsStatisticsContainer.replaceChildren();
            divCollectionsStatisticsContainer.className = "";
            if (currentFinder.getActive() === true) {
                divCollectionsStatisticsContainer.appendChild(divStatistic);
            }
        } else {
            let divMessage = document.createElement("div");
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.style.padding = "30px";
            divMessage.textContent = "Не удалось отобразить статистику.";

            if (currentFinder.getActive() === true) {
                divCollectionsStatisticsContainer.replaceChildren();
                if (currentFinder.getActive() === true) {
                    divCollectionsStatisticsContainer.appendChild(divMessage);
                }
            }
        }
    }
}
//---

// Поиск коллекций ---
function showLoadingInCollectionsTable() {
    // Отображаем загрузку в таблице ---
    let tableHead = document.getElementById(_THEAD_COLLECTIONS_ID);
    let tableBody = document.getElementById(_TBODY_COLLECTIONS_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }
    //---
}

function prepareCollectionsFinder() {
    let currentFinder = _CUSTOM_TIMER_COLLECTIONS_FINDER;

    if (currentFinder) {
        currentFinder.setTimeout(_TIMEOUT_FOR_FINDERS);
        currentFinder.setHandler(async function() {
            _lastCollectionNumberInList = 0;
            _lastCollectionIdOnPreviousPage = 0n;

            // Очищаем мапу таймеров слов в коллекциях ---
            for (let key of _wordsInCollectionItemsForFindMap.keys()) {
                let wordsInCollectionItemsForFind = _wordsInCollectionItemsForFindMap.get(key);
                if (wordsInCollectionItemsForFind.customTimerFinder) {
                    wordsInCollectionItemsForFind.customTimerFinder.stop();
                }
            }

            _wordsInCollectionItemsForFindMap.clear();
            //---

            await tryToFillCollectionsTable(true, true);
        })
    }

}

function startToFindCollections() {
    let currentFinder = _CUSTOM_TIMER_COLLECTIONS_FINDER;

    if (currentFinder) {
        currentFinder.stop();
    }

    showLoadingInCollectionsTable();

    if (currentFinder) {
        currentFinder.start();
    }
}

async function tryToFillCollectionsTable(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_COLLECTIONS_FINDER;

    let title;
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        title = tbFinder.value.trim();
    }

    let langCode;
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs) {
        langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbLangs);
    }

    let isActive;
    let cbIsActive = document.getElementById(_CB_IS_ACTIVE_ID);
    if (cbIsActive) {
        isActive = cbIsActive.selectedIndex === 0;
    }

    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();

    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getAllForAuthorFilteredPagination(
        title, langCode, authId, isActive, _NUMBER_OF_ITEMS, _lastCollectionIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createCollectionsTableRows(JSONResponse.json);

        let tableBody = document.getElementById(_TBODY_COLLECTIONS_ID);
        if (tableBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tableBody.replaceChildren();
            }

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tableBody.appendChild(tableRows[i]);
            }
        }
    } else if (doNeedToShowTableMessage === true) {
        let message = new CustomResponseMessage(JSONResponse.json).text;

        let tableHead = document.getElementById(_THEAD_COLLECTIONS_ID);
        let tableBody = document.getElementById(_TBODY_COLLECTIONS_ID);
        if (tableHead && tableBody) {
            let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
            let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

            if (currentFinder.getActive() === true) {
                tableBody.replaceChildren();
                if (currentFinder.getActive() === true) {
                    tableBody.appendChild(trMessage);
                }
            }
        }
    }
}

async function createCollectionsTableRows(collectionsJson) {
    let currentFinder = _CUSTOM_TIMER_COLLECTIONS_FINDER;
    let tableRows = [];

    for (let i = 0; i < collectionsJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
        let collection = new CustomerCollectionResponseDTO(collectionsJson[i]);

        let row = await createCollectionTableRow(collection);
        if (row) {
            tableRows.push(row);
        }

        // Получаем id последнего элемента JSON-коллекции
        if (i === collectionsJson.length - 1) {
            _lastCollectionIdOnPreviousPage = collection.id;
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (currentFinder.getActive() === true &&
        collectionsJson.length === _NUMBER_OF_ITEMS) {
        let tableHead = document.getElementById(_THEAD_COLLECTIONS_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let message =  `Показать ещё ${_NUMBER_OF_ITEMS} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function () {
                await tryToFillCollectionsTable(false, false);
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createCollectionTableRow(customerCollection) {
    // Создаём контейнер для информации о коллекции пользователя
    // В него помещаем:
    // 1. Таблицу с информацией о коллекции пользователя
    // 2. Контейнер с таблицей слов в выбранной коллекции ---
    let divCustomerCollectionContainer = document.createElement("div");
    //---

    // Создаём строку ---
    const _MIN_HEIGHT_ROW = "200px";
    let tr = document.createElement("tr");
    tr.style.minHeight = _MIN_HEIGHT_ROW;
    //---

    // Номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${++_lastCollectionNumberInList}.`;

    tr.appendChild(td);
    //---

    // Коллекция ---
    td = document.createElement("td");
    await td.appendChild(await customerCollection.createDivInfo());

    tr.appendChild(td);
    //---

    // Активность ---
    td = document.createElement("td");
    td.style.padding = "1px";

    let cbIsActive = document.createElement("select");
    cbIsActive.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
    _COMBO_BOX_UTILS.prepareCbBoolean(cbIsActive);

    cbIsActive.style.minHeight = _MIN_HEIGHT_ROW;
    cbIsActive.style.width = "100%";
    cbIsActive.selectedIndex = customerCollection.isActiveForAuthor === true ? 0 : 1;
    _COMBO_BOX_UTILS.callChangeEvent(cbIsActive);

    cbIsActive.addEventListener("change", async function() {
        this.disabled = true;
        let isActive = this.selectedIndex === 0;

        let dto = new CustomerCollectionRequestDTO();
        dto.id = customerCollection.id;
        dto.isActiveForAuthor = isActive;

        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.PATCH.changeActivityForAuthor(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            this.disabled = false;
            startToFindStatistic();
        }
    });
    td.appendChild(cbIsActive);

    tr.appendChild(td);
    //---

    // Действия ---
    let divActions = document.createElement("div");
    divActions.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
    divActions.style.grid = "1fr 1fr / 1fr";
    divActions.style.gap = "5px";

    let aButtonImgSize = _A_BUTTON_IMG_SIZES.SIZE_32;
    let aBtnDelete = _A_BUTTONS.A_BUTTON_DENY_DOUBLE_CLICK.createA(aButtonImgSize, async function() {
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnDelete, aButtonImgSize);
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnWordsInCollectionAction, aButtonImgSize);

        let dto = new CustomerCollectionRequestDTO();
        dto.id = customerCollection.id;

        await _CUSTOMER_COLLECTIONS_API.DELETE.delete(dto);

        // Запускаем поиск статистики ---
        startToFindStatistic();
        //----

        // Отключаем выпадающий список изменения активности ---
        cbIsActive.disabled = true;
        //---

        // Отключаем кнопку удаления ---
        _A_BUTTONS.A_BUTTON_ACCEPT.setStyles(aBtnDelete, aButtonImgSize);
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnDelete, aButtonImgSize);
        //---

        // Отключаем кнопку отображения слов в коллекции ---
        changeToHideWordsInCollectionAction(
            aBtnWordsInCollectionAction, divCustomerCollectionContainer, customerCollection.id);
        _A_BUTTONS.callClickEvent(aBtnWordsInCollectionAction);
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnWordsInCollectionAction, aButtonImgSize);
        //---
    });
    aBtnDelete.title = "Удалить коллекцию";
    divActions.appendChild(aBtnDelete);

    let aBtnWordsInCollectionAction = _A_BUTTONS.A_BUTTON_ARROW_DOWN.createA(aButtonImgSize);
    changeToShowWordsInCollectionAction(
        aBtnWordsInCollectionAction, divCustomerCollectionContainer, customerCollection.id);
    divActions.appendChild(aBtnWordsInCollectionAction);

    td = document.createElement("td");
    td.appendChild(divActions);

    tr.appendChild(td);
    //---

    // Создаём tBody для таблицы, которая будет внутри основной таблицы ---
    let tBody = document.createElement("tbody");
    if (_lastCollectionNumberInList % 2 === 0) {
        let invisibleRow = document.createElement("tr");
        tBody.appendChild(invisibleRow);
    }
    tBody.appendChild(tr);
    //---

    // Клонируем colgroup с основной таблицы ---
    let colgroupCollections = document.getElementById(_COLGROUP_COLLECTIONS_ID);
    let colgroup = colgroupCollections.cloneNode(true);
    //---

    // Создаём таблицу, которая будет внутри основной таблицы, добавляем её в основной контейнер ---
    let table = document.createElement("table");
    table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);
    if (_lastCollectionNumberInList % 2 === 0) {
        table.style.margin = "-10px -5px -5px -5px";
    }

    table.appendChild(colgroup);
    table.appendChild(tBody);

    divCustomerCollectionContainer.appendChild(table);
    //---

    // Создаём строку, в которой будет наш созданный контейнер ---
    td = document.createElement("td");
    td.style.padding = "0";
    td.colSpan = colgroupCollections.childElementCount;
    td.appendChild(divCustomerCollectionContainer);
    //---

    // Создаём итоговую строку ---
    tr = document.createElement("tr");
    tr.style.background = "none";
    tr.appendChild(td);
    //---

    return tr;
}

function changeToShowWordsInCollectionAction(aBtnShowWordsInCollectionAction,
                                             divCustomerCollectionContainer,
                                             collectionId) {
    _A_BUTTONS.A_BUTTON_ARROW_DOWN.setStyles(aBtnShowWordsInCollectionAction, _A_BUTTON_IMG_SIZES.SIZE_32);
    aBtnShowWordsInCollectionAction.title = "Показать слова в коллекции";
    aBtnShowWordsInCollectionAction.onclick = null;

    aBtnShowWordsInCollectionAction.onclick = async function() {
        let wordsInCollectionItemsForFind = _wordsInCollectionItemsForFindMap.get(collectionId);
        if (!wordsInCollectionItemsForFind) {
            // Создаём таблицу ---
            let table = document.createElement("table");
            table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);
            //---

            // Создаём colgroup ---
            let colgroup = document.createElement("colgroup");

            let col = document.createElement("col");
            col.style.width = "5%";
            colgroup.appendChild(col);

            col = col.cloneNode(false);
            col.style.width = "65%";
            colgroup.appendChild(col);

            col = col.cloneNode(false);
            col.style.width = "30%";
            colgroup.appendChild(col);

            table.appendChild(colgroup);
            //---

            // Создаём tHead ---
            let tHead = document.createElement("thead");

            let tr = document.createElement("tr");

            let th = document.createElement("th");
            th.textContent = "№";
            tr.appendChild(th);

            th = th.cloneNode(false);
            th.textContent = "Слово";
            tr.appendChild(th);

            th = th.cloneNode(false);
            th.textContent = "Язык";
            tr.appendChild(th);

            tHead.appendChild(tr);
            table.appendChild(tHead);
            //---

            // Создаём tBody ---
            let tBody = document.createElement("tbody");
            tBody.appendChild(_TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading())
            table.appendChild(tBody);
            //---

            // Подготавливаем таймер ---
            let customTimerFinder = new CustomTimer();
            customTimerFinder.setTimeout(_TIMEOUT_FOR_FINDERS);
            customTimerFinder.setHandler(async function() {
                wordsInCollectionItemsForFind.lastWordInCollectionNumberInList = 0;
                wordsInCollectionItemsForFind.lastWordInCollectionIdOnPreviousPage = 0n;

                await tryToFillWordsInCollectionTableForCurrentCollection(collectionId, true, true);
            })
            //---

            wordsInCollectionItemsForFind = new WordsInCollectionItemsForFind(table, tHead, tBody, customTimerFinder);
            _wordsInCollectionItemsForFindMap.set(collectionId, wordsInCollectionItemsForFind);
        }

        // Добавляем таблицу со словами в коллекции ---
        let divWordsInCollectionContainer =
            _TABLE_UTILS.createElementBetweenTwoHorizontalDelimiters(wordsInCollectionItemsForFind.table);
        divCustomerCollectionContainer.appendChild(divWordsInCollectionContainer);
        //---

        startToFindWordsInCollectionForCurrentCollection(wordsInCollectionItemsForFind);
        changeToHideWordsInCollectionAction(
            aBtnShowWordsInCollectionAction, divCustomerCollectionContainer, collectionId);
    }
}

function changeToHideWordsInCollectionAction(aBtnShowWordsInCollectionAction,
                                             divCustomerCollectionContainer,
                                             collectionId) {
    _A_BUTTONS.A_BUTTON_ARROW_UP.setStyles(aBtnShowWordsInCollectionAction, _A_BUTTON_IMG_SIZES.SIZE_32);
    aBtnShowWordsInCollectionAction.title = "Скрыть слова в коллекции";
    aBtnShowWordsInCollectionAction.onclick = null;

    aBtnShowWordsInCollectionAction.onclick = async function() {
        // Завершаем поиск, удаляем контейнер с историей из родителя ---
        let wordStatusHistoryItemsForFind = _wordsInCollectionItemsForFindMap.get(collectionId);
        if (wordStatusHistoryItemsForFind) {
            wordStatusHistoryItemsForFind.customTimerFinder.stop();
            divCustomerCollectionContainer.removeChild(wordStatusHistoryItemsForFind.table.parentElement);
        }
        //---

        changeToShowWordsInCollectionAction(
            aBtnShowWordsInCollectionAction, divCustomerCollectionContainer, collectionId)
    }
}
//---

// Поиск слов в выделенной коллекции ---
function startToFindWordsInCollectionForCurrentCollection(wordsInCollectionItemsForFind) {
    if (wordsInCollectionItemsForFind) {
        let customTimerFinder = wordsInCollectionItemsForFind.customTimerFinder;
        if (customTimerFinder) {
            customTimerFinder.stop();
        }
    }

    // Отображаем загрузку ---
    let tHead = wordsInCollectionItemsForFind.tHead;
    let tBody = wordsInCollectionItemsForFind.tBody;
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);
        for (let trChild of trLoading.childNodes) {
            trChild.style.padding = "20px";
        }

        tBody.replaceChildren();
        tBody.appendChild(trLoading);
    }
    //---

    if (wordsInCollectionItemsForFind) {
        let customTimerFinder = wordsInCollectionItemsForFind.customTimerFinder;
        if (customTimerFinder) {
            customTimerFinder.start();
        }
    }
}

async function tryToFillWordsInCollectionTableForCurrentCollection(collectionId,
                                                                   doNeedToClearTable,
                                                                   doNeedToShowTableMessage) {
    let wordsInCollectionItemsForFind = _wordsInCollectionItemsForFindMap.get(collectionId);
    if (wordsInCollectionItemsForFind) {
        let currentFinder = wordsInCollectionItemsForFind.customTimerFinder;

        let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(
            collectionId, wordsInCollectionItemsForFind.numberOfItems, "",
            wordsInCollectionItemsForFind.lastWordInCollectionIdOnPreviousPage)
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = createWordsInCollectionTableRowsForCurrentCollection(
                JSONResponse.json, collectionId, wordsInCollectionItemsForFind);
            let tBody = wordsInCollectionItemsForFind.tBody;
            if (tableRows && tBody && currentFinder.getActive() === true) {
                if (doNeedToClearTable === true) {
                    tBody.replaceChildren();
                }

                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tBody.appendChild(tableRows[i]);
                }
            }
        } else if (doNeedToShowTableMessage === true) {
            let tHead = wordsInCollectionItemsForFind.tHead;
            let tBody = wordsInCollectionItemsForFind.tBody;
            if (tHead && tBody) {
                let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
                let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(
                    numberOfColumns, new CustomResponseMessage(JSONResponse.json).text);

                if (currentFinder.getActive() === true) {
                    tBody.replaceChildren();
                    if (currentFinder.getActive() === true) {
                        tBody.appendChild(trMessage);
                    }
                }
            }
        }
    }
}

function createWordsInCollectionTableRowsForCurrentCollection(wordsInCollectionJson,
                                                              collectionId,
                                                              wordsInCollectionItemsForFind) {
    let currentFinder = wordsInCollectionItemsForFind.customTimerFinder;
    let tableRows = [];

    for (let i = 0; i < wordsInCollectionJson.length; i++) {
        let wordInCollection = new WordInCollectionResponseDTO(wordsInCollectionJson[i]);

        let row = createWordsInCollectionTableRowForCurrentCollection(
            wordInCollection, wordsInCollectionItemsForFind);
        if (row) {
            tableRows.push(row);
        }

        // Получаем id последнего элемента JSON-коллекции ---
        if (i === wordsInCollectionJson.length - 1) {
            wordsInCollectionItemsForFind.lastWordInCollectionIdOnPreviousPage = wordInCollection.id;
        }
        //---
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу ---
    if (currentFinder.getActive() === true &&
        wordsInCollectionJson.length === wordsInCollectionItemsForFind.numberOfItems) {
        let tableHead = document.getElementById(_THEAD_COLLECTIONS_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let message =  `Показать ещё ${wordsInCollectionItemsForFind.numberOfItems} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function () {
                await tryToFillWordsInCollectionTableForCurrentCollection(
                    collectionId, false, false);
            });

        tableRows.push(trShowMore);
    }
    //---

    return tableRows;
}

function createWordsInCollectionTableRowForCurrentCollection(wordInCollection, wordsInCollectionItemsForFind) {
    let tr = document.createElement("tr");

    // Номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${++wordsInCollectionItemsForFind.lastWordInCollectionNumberInList}.`;

    tr.appendChild(td);
    //---

    // Слово ---
    td = document.createElement("td");
    td.textContent = wordInCollection.word.title;

    tr.appendChild(td);
    //---

    // Язык ---
    td = document.createElement("td");
    td.appendChild(wordInCollection.word.lang.createDiv());

    tr.appendChild(td);
    //---

    // Увеличиваем padding на всех children у каждой строки ---
    for (let i = 0; i < tr.childElementCount; i++) {
        tr.children.item(i).style.padding = "20px";
    }
    //---

    return tr;
}
//---