import {
    getJSONResponseWordsCountByDateOfCreate,
    getJSONResponseWordsCountByWordStatusCode,
    getJSONResponseWordsFilteredPagination
} from "../../api/words.js";

import {
    getJSONResponseFindWordInCollectionByCollectionKeyAndWordId,
    getJSONResponseValidateCollectionAndWordLangs,

} from "../../api/words_in_collection.js";

import {
    createBtnShowMore,
    removeBtnShowMore,
    createBtnAcceptInTable,
    buildABtnDisabledInTable
} from "../../utils/btn_utils.js";

import {
    getSelectedOptionId,
    fillCbPartsOfSpeech,
    fillCbLangs,
    fillCbCustomerCollections,
    changeCbLangsEnabledByCbCustomerCollectionKey
} from "../../utils/combo_box_utils.js";

import {
    findInTableWithTimers,
    setMessageInsideTable
} from "../../utils/table_utils.js";

import {
    changeToAcceptInWordTable,
    changeToDenyInWordTable
} from "../../utils/word_table_utils.js";

import {
    getGlobalCookie
} from "../../utils/global_cookie_utils.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    Timer
} from "../../classes/timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WordStatuses
} from "../../classes/api/word_statuses.js";

import {
    getJSONResponseAllWordStatuses
} from "../../api/word_statuses.js";

import {
    getJSONResponseFindCollectionByCustomerIdAndKey
} from "../../api/customer_collections.js";

import {
    DateElements
} from "../../classes/date_elements.js";

import {
    WordStatusWithCount,
    compareWordStatusWithCount
} from "../../classes/word_status_with_count.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    WordResponseDTO
} from "../../dto/word.js";

import {
    WordInCollectionResponseDTO
} from "../../dto/word_in_collection.js";

import {
    WordStatusResponseDTO
} from "../../dto/word_status.js";

import {
    LongResponse
} from "../../dto/other/long_response.js";

import {
    CustomerCollectionResponseDTO
} from "../../dto/customer_collection.js";

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _WORD_STATUSES = new WordStatuses();

const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _TB_FINDER_ID = "tb_finder";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _CB_LANGS_ID = "cb_langs";
const _WORDS_TABLE_HEAD_ID = "words_table_head";
const _WORDS_TABLE_BODY_ID = "words_table_body";
const _WORD_LIST_CONTAINER_ID = "word_list_container";
const _BTN_SHOW_MORE = "btn_show_more";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _DIV_WORDS_STATISTICS_CONTAINER_ID = "words_statistics_container";
const _BTN_REFRESH_ID = "btn_refresh";

const _NUMBER_OF_WORDS = 20;

let _lastWordNumberInList = 0;
let _lastWordIdOnPreviousPage = 0n;

let _tWaiter = new Timer(null);
let _tFinder = new Timer(null);

// Загружаем скрипты на страницу
window.onload = async function () {
    await prepareCbCustomerCollections();
    await prepareCbPartsOfSpeech();
    await prepareCbLangs();

    let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
    await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

    prepareTbFinder();
    prepareBtnRefresh();

    await tryToFillTable();
}

function waiter() {
    removeBtnShowMore(_BTN_SHOW_MORE);
    let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    setMessageInsideTable(tableHead, tableBody, "Идёт поиск...", true);
}

// Подготовка выпадающего списка "Коллекция пользователя по умолчанию"
async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections != null) {
        await fillCbCustomerCollections(cbCustomerCollections);
        cbCustomerCollections.addEventListener("change", async function () {
            let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
            await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillTable);
        })
    }
}

// Подготовка поля "Поиск"
function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    // Вешаем событие обновления списка при изменении текста
    tbFinder.addEventListener("input", async function () {
        findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillTable);
    });
}

// Подготовка выпадающего списка "Части речи"
async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbPartsOfSpeech.appendChild(firstOption);

        await fillCbPartsOfSpeech(cbPartsOfSpeech);
        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbPartsOfSpeech.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillTable);
        });
    }
}

// Подготовка выпадающего списка "Языки"
async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbLangs.appendChild(firstOption);

        await fillCbLangs(cbLangs);
        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbLangs.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillTable);
        })
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            btnRefresh.disabled = true;
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillTable);
            btnRefresh.disabled = false;
        })
    }
}

// Подготавливаем GET-запрос и получаем ответ
async function getPreparedJSONResponseWordsFilteredPagination() {
    let title = document.getElementById(_TB_FINDER_ID).value;
    let partOfSpeechCode =  getSelectedOptionId(_CB_PARTS_OF_SPEECH_ID);
    let langCode =  getSelectedOptionId(_CB_LANGS_ID);

    return await getJSONResponseWordsFilteredPagination(_NUMBER_OF_WORDS, title,
        _WORD_STATUSES.ACTIVE.CODE, partOfSpeechCode, langCode, _lastWordIdOnPreviousPage);
}

// Заполнение таблицы с предварительной очисткой
async function tryToFillTable() {
    _lastWordNumberInList = 0;
    _lastWordIdOnPreviousPage = 0n;

    let readyToFill = true;
    let badRequestText = null;

    // Проверяем принадлежность коллекции к авторизированному пользователю (при условии, что он авторизирован)
    // Если принадлежит - работаем дальше ---
    let authCustomerId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    if (authCustomerId) {
        let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
        let JSONResponse = await
            getJSONResponseFindCollectionByCustomerIdAndKey(authCustomerId, collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);

            // Генерируем информацию о коллекции
            // Если информация уже существовала, мы должны удалить предыдущую,
            // сгенерировать новую, но не удалять сам контейнер!
            let divCustomerCollectionId = "customer_collection_info";
            let divCustomerCollection = document.getElementById(divCustomerCollectionId);
            if (divCustomerCollection) {
                await customerCollection.changeDiv(divCustomerCollection);
            } else {
                divCustomerCollection = await customerCollection.createDiv();

                let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
                divCollectionInfo.replaceChildren();
                divCollectionInfo.appendChild(divCustomerCollection);
            }
        } else {
            readyToFill = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            badRequestText = message.text;

            let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
            divCollectionInfo.replaceChildren();
        }
    }
    //---

    // Получаем JSON для заполнения таблицы ---
    let wordsFilteredPaginationJson = null;
    if (readyToFill) {
        let JSONResponse = await getPreparedJSONResponseWordsFilteredPagination();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            wordsFilteredPaginationJson = JSONResponse.json;
        } else {
            readyToFill = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            badRequestText = message.text;
        }
    }
    //---

    // Генерируем статистику по словам, очищаем таблицу ---
    await generateWordStatistics();

    removeBtnShowMore(_BTN_SHOW_MORE);
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    tableBody.replaceChildren();
    //---

    if (readyToFill) {
        // Заполняем таблицу
        await fillWordsTable(wordsFilteredPaginationJson);
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
        setMessageInsideTable(tableHead, tableBody, badRequestText, true);
    }
}

// Заполнение таблицы
async function fillWordsTable(wordsFilteredPaginationJson) {
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    let authCustomerId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    for (let i = 0; i < wordsFilteredPaginationJson.length; i++) {
        let word = new WordResponseDTO(wordsFilteredPaginationJson[i]);

        // Создаём строку таблицы ---
        let row = document.createElement("tr");
        //---

        // Порядковый номер строки ---
        let numberColumn = document.createElement("td");
        numberColumn.style.textAlign = "center";
        numberColumn.textContent = `${++_lastWordNumberInList}.`;
        row.appendChild(numberColumn);
        //---

        // Текст слова ---
        let titleColumn = document.createElement("td");
        titleColumn.textContent = word.title;
        row.appendChild(titleColumn);
        //---

        // Язык ---
        let langColumn = document.createElement("td");
        langColumn.appendChild(word.lang.createDivLangWithFlag());
        row.appendChild(langColumn);
        //---

        // Часть речи ---
        let partOfSpeechColumn = document.createElement("td");
        partOfSpeechColumn.appendChild(word.partOfSpeech.createDiv());
        row.appendChild(partOfSpeechColumn);
        //---

        // кнопка добавления/удаления слова (только для авторизированных пользователей) ---
        if (authCustomerId) {
            let actionColumn = document.createElement("td");
            actionColumn.appendChild(await createBtnAction(word.id));
            row.appendChild(actionColumn);
        }
        //---

        // Добавляем строку в таблицу ---
        tableBody.appendChild(row);
        //---

        // Получаем id последнего элемента JSON-коллекции ---
        if (i === wordsFilteredPaginationJson.length - 1) {
            _lastWordIdOnPreviousPage = word.id;
        }
        //---
    }

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (wordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let wordListContainer =
            document.getElementById(_WORD_LIST_CONTAINER_ID);
        let btnShowMore = createBtnShowMore(_BTN_SHOW_MORE, _NUMBER_OF_WORDS);
        if (wordListContainer != null && btnShowMore != null) {
            btnShowMore.addEventListener("click", async function () {
                let JSONResponse = await getPreparedJSONResponseWordsFilteredPagination();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    await fillWordsTable(JSONResponse.json);
                }
            });
            wordListContainer.appendChild(btnShowMore);
        }
    }
}

// Создание кнопки события
async function createBtnAction(wordId) {
    let btnAction = createBtnAcceptInTable();

    let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
    let JSONResponse = await getJSONResponseValidateCollectionAndWordLangs(collectionKey, wordId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        JSONResponse = await
            getJSONResponseFindWordInCollectionByCollectionKeyAndWordId(collectionKey, wordId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);
            await changeToDenyInWordTable(btnAction, wordInCollection.id);
        } else {
            await changeToAcceptInWordTable(btnAction, collectionKey, wordId);
        }
    } else {
        buildABtnDisabledInTable(btnAction);

        let message = new CustomResponseMessage(JSONResponse.json);
        btnAction.title = message.text;
    }

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(btnAction);

    return divContainer;
}

async function generateWordStatistics() {
    let wordsStatisticContainer = document.getElementById(_DIV_WORDS_STATISTICS_CONTAINER_ID);
    if (wordsStatisticContainer != null) {
        // Генерируем статистику по всем статусам слов
        let dateNow = new Date();
        let JSONResponseWordStatuses = await getJSONResponseAllWordStatuses();
        let JSONResponseWordsToday = await getJSONResponseWordsCountByDateOfCreate(dateNow);
        if (JSONResponseWordStatuses.status === _HTTP_STATUSES.OK
            && JSONResponseWordsToday.status === _HTTP_STATUSES.OK) {
            // Генерируем контейнер для статистики всех статусов слов ---
            let divStatisticForWordStatuses = document.createElement("div");
            //---

            // Генерируем статистику по всем статусам ---
            let wordStatusesJson = JSONResponseWordStatuses.json;
            let wordStatusesWithCount = [];
            let numberOfWordsSum = 0n;
            for (let i = 0; i < wordStatusesJson.length; i++) {
                let wordStatus = new WordStatusResponseDTO(wordStatusesJson[i]);
                let JSONResponseNumberOfWords =
                    await getJSONResponseWordsCountByWordStatusCode(wordStatus.code);
                if (JSONResponseNumberOfWords.status === _HTTP_STATUSES.OK) {
                    let longResponse = new LongResponse(JSONResponseNumberOfWords.json);
                    numberOfWordsSum += longResponse.value;

                    let wordStatusWithCount = new WordStatusWithCount(wordStatus, longResponse.value);
                    wordStatusesWithCount.push(wordStatusWithCount);
                }
            }

            // Генерируем статистику по словам ---
            wordStatusesWithCount.sort(compareWordStatusWithCount);
            for (let i = 0; i < wordStatusesWithCount.length; i++) {
                divStatisticForWordStatuses.appendChild(wordStatusesWithCount[i].createDiv());
            }
            //---

            // Сумма всех слов ---
            let spanNumberOfWordsText = document.createElement("span");
            spanNumberOfWordsText.style.fontWeight = "bold";
            spanNumberOfWordsText.textContent = "Общее количество слов в базе";

            let spanNumberOfWordsSum = document.createElement("span");
            spanNumberOfWordsSum.textContent = `: ${numberOfWordsSum}`;

            let divNumberOfWordsSumContainer = document.createElement("div");
            divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsText);
            divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsSum);
            //---

            // Количество слов за сегодняшний день
            let numberOfWordsToday = new LongResponse(JSONResponseWordsToday.json);
            let dateNowElements = new DateElements(dateNow);

            let spanNumberOfWordsTodayText = document.createElement("span");
            spanNumberOfWordsTodayText.style.fontWeight = "bold";
            spanNumberOfWordsTodayText.textContent = `За сегодня (${dateNowElements.getDateStr()}) добавлено`;

            let spanNumberOfWordsTodaySum = document.createElement("span");
            spanNumberOfWordsTodaySum.textContent = `: ${numberOfWordsToday.value}`;

            let divNumberOfWordsTodayContainer = document.createElement("div");
            divNumberOfWordsTodayContainer.appendChild(spanNumberOfWordsTodayText);
            divNumberOfWordsTodayContainer.appendChild(spanNumberOfWordsTodaySum);
            //

            // Добавляем элементы в основной контейнер ---
            wordsStatisticContainer.replaceChildren();
            wordsStatisticContainer.appendChild(divNumberOfWordsSumContainer);
            wordsStatisticContainer.appendChild(divStatisticForWordStatuses);
            wordsStatisticContainer.appendChild(document.createElement("br"));
            wordsStatisticContainer.appendChild(divNumberOfWordsTodayContainer);
            wordsStatisticContainer.appendChild(document.createElement("br"));
            //---
        }
    }
}
