import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    WordInCollectionRequestDTO,
    WordInCollectionResponseDTO
} from "../../classes/dto/entity/word_in_collection.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

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
    AButtons
} from "../../classes/a_buttons/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    WordTableUtils
} from "../../classes/utils/for_templates/word_table_utils.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

import {
    AButtonImgSizes
} from "../../classes/a_buttons/a_button_img_sizes.js";

import {
    ComboBoxWithFlag
} from "../../classes/element_with_flag/combo_box_with_flag.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    CustomerCollectionResponseDTO
} from "../../classes/dto/entity/customer_collection.js";

import {
    BigIntUtils
} from "../../classes/utils/bigint_utils.js";

import {
    ButtonUtils
} from "../../classes/utils/button_utils.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _WORD_TABLE_UTILS = new WordTableUtils();
const _TEXT_BOX_UTILS = new TextBoxUtils();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();
const _BIGINT_UTILS = new BigIntUtils();
const _BUTTON_UTILS = new ButtonUtils();

const _TB_FINDER_ID = "tb_finder";
const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _COLLECTION_WORD_TABLE_HEAD_ID = "collection_word_table_head";
const _COLLECTION_WORD_TABLE_BODY_ID = "collection_word_table_body";
const _DIV_COLLECTIONS_STATISTICS_CONTAINER_ID = "collections_statistics_container";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_COLLECTION_FLAG_ID = "collection_flag";

const _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS = 5;
const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _CUSTOM_TIMER_FOR_REFRESH = new CustomTimer();

window.onload = async function () {
    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareCollectionInfoFinder();
    prepareWordsInCollectionFinder();
    //---

    await prepareCbCustomerCollections();
    prepareTbFinder();
    prepareBtnRefresh();

    startAllFinders();
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startAllFinders, _CUSTOM_TIMER_TB_FINDER);
    }
}

async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
    if (cbCustomerCollections && divCollectionFlag) {
        let comboBoxWithFlag =
            new ComboBoxWithFlag(cbCustomerCollections.parentElement, cbCustomerCollections, divCollectionFlag);
        await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.prepare(
            comboBoxWithFlag, null, false);

        cbCustomerCollections.addEventListener("change", startAllFinders);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", async function() {
            changeDisableStatusToFinderInstruments(true);

            // Отображаем загрузки на момент перезагрузки ---
            showLoadingInStatistic();
            showLoadingInCollectionInfo();
            showLoadingInTable();
            //---

            let refreshPromise = new Promise(resolve => {
                _CUSTOM_TIMER_FOR_REFRESH.stop();

                _CUSTOM_TIMER_FOR_REFRESH.setTimeout(500);
                _CUSTOM_TIMER_FOR_REFRESH.setHandler(async function() {
                    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
                    let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
                    if (cbCustomerCollections && divCollectionFlag) {
                        let comboBoxWithFlag =
                            new ComboBoxWithFlag(cbCustomerCollections.parentElement, cbCustomerCollections, divCollectionFlag);

                        await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.fill(comboBoxWithFlag, null);
                    }

                    resolve();
                });

                _CUSTOM_TIMER_FOR_REFRESH.start();
            });
            await refreshPromise;

            startAllFinders();
            changeDisableStatusToFinderInstruments(false);
        });
    }
}

function startAllFinders() {
    startToFindStatistic();
    startToFindCollectionInfo();
    startToFindWordsInCollection();
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

    let cbCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCollections) {
        cbCollections.disabled = isDisable;
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
    _CUSTOM_TIMER_STATISTIC_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_STATISTIC_FINDER.setHandler(async function () {
        await tryToFillStatistic();
    });
}

function startToFindStatistic() {
    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.stop();
    }

    showLoadingInStatistic();

    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.start();
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

// Информация о коллекции ---
function showLoadingInCollectionInfo() {
    let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfo) {
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }
}

function prepareCollectionInfoFinder() {
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setHandler(async function() {
        await tryToFillCollectionInfo();
    });
}

function startToFindCollectionInfo() {
    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.stop();
    }

    showLoadingInCollectionInfo();

    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.start();
    }
}

async function tryToFillCollectionInfo() {
    let currentFinder = _CUSTOM_TIMER_COLLECTION_INFO_FINDER;

    let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfoContainer) {
        let isCorrect = true;
        let message;

        let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
        if (!collectionId) {
            isCorrect = false;
            message = "Выберите коллекцию.";
        }

        if (isCorrect === true) {
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(collectionId);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);
                let divCollectionInfo = await customerCollection.tryToCreateDivInfoAfterValidate();

                if (currentFinder.getActive() === true) {
                    divCollectionInfoContainer.replaceChildren();
                    if (currentFinder.getActive() === true) {
                        divCollectionInfoContainer.appendChild(divCollectionInfo);
                    }
                }
            } else {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }
        }

        if (isCorrect === false) {
            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.textContent = message;

            if (currentFinder.getActive() === true) {
                divCollectionInfoContainer.replaceChildren();
                if (currentFinder.getActive() === true) {
                    divCollectionInfoContainer.appendChild(divMessage);
                }
            }
        }
    }
}
//---

// Слова в коллекции ---
function showLoadingInTable() {
    // Отображаем загрузку в таблице ---
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }
    //---
}

function prepareWordsInCollectionFinder() {
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setHandler(async function() {
        let readyToFill = true;

        let collectionIdStr = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let collectionId = _BIGINT_UTILS.parse(collectionIdStr);
        if (!collectionId) {
            readyToFill = false;
            setMessageInsideTable("Выберите коллекцию.");
        }

        // Коллекция должна принадлежать пользователю ---
        if (readyToFill === true) {
            let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
            let JSONResponse = await
                _CUSTOMER_COLLECTIONS_API.GET.validateIsCustomerCollectionAuthor(authId, collectionId);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                readyToFill = false;
                setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
            }
        }
        //---

        // Коллекция должна быть активна для автора ---
        if (readyToFill === true) {
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsActiveForAuthorByCollectionId(collectionId);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                readyToFill = false;
                setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
            }
        }
        //---

        if (readyToFill === true) {
            _lastWordNumberInList = 0;
            _lastWordInCollectionIdOnPreviousPage = 0n;

            await tryToFillTableRows(true, true);
        }
    });
}

function startToFindWordsInCollection() {
    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.stop();
    }

    showLoadingInTable();

    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.start();
    }
}

async function tryToFillTableRows(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let collectionId = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let title = document.getElementById(_TB_FINDER_ID).value;
    let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(collectionId,
        _NUMBER_OF_WORDS, title, _lastWordInCollectionIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        if (tableRows && tableBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tableBody.replaceChildren();
            }

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tableBody.appendChild(tableRows[i]);
            }
        }
    } else if (doNeedToShowTableMessage === true) {
        setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
    }
}

async function createTableRows(allWordsInCollectionFilteredPaginationJson){
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;
    let tableRows = [];

    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
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

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (currentFinder.getActive() === true
        && allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let message =  `Показать ещё ${_NUMBER_OF_WORDS} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function (){
                await tryToFillTableRows(false, false);
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createTableRow(wordInCollectionResponseDTO) {
    let row = document.createElement("tr");

    // Порядковый номер ---
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

    // Действия ---
    let actionColumn = document.createElement("td");
    let wordInCollectionRequestDTO = new WordInCollectionRequestDTO();
    wordInCollectionRequestDTO.id = wordInCollectionResponseDTO.id;
    wordInCollectionRequestDTO.wordId = wordInCollectionResponseDTO.word.id;
    wordInCollectionRequestDTO.collectionId = wordInCollectionResponseDTO.customerCollection.id;

    actionColumn.appendChild(await createBtnAction(wordInCollectionRequestDTO));
    row.appendChild(actionColumn);
    //---

    return row;
}

async function createBtnAction(wordInCollectionRequestDTO) {
    let aBtnAction = _A_BUTTONS.A_BUTTON_DENY.createA(_A_BUTTON_IMG_SIZES.SIZE_16);
    await _WORD_TABLE_UTILS.changeToRemoveAction(aBtnAction, wordInCollectionRequestDTO);

    aBtnAction.addEventListener("click", function () {
        startToFindCollectionInfo();
    })

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(aBtnAction);

    return divContainer;
}

function setMessageInsideTable(message) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tableBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tableBody.appendChild(trMessage);
            }
        }
    }
}
//---