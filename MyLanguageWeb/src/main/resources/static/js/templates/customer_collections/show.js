import {
    getJSONResponseAllWordsInCollectionFilteredPagination,
} from "../../api/words_in_collection.js";

import {
    getSelectedOptionId,
    fillCbLangs,
    fillCbPartsOfSpeech,
    fillCbCustomerCollections,
    changeCbLangsEnabledByCbCustomerCollectionKey
} from "../../utils/combo_box_utils.js";

import {
    createBtnDenyInTable,
    createBtnShowMore,
    removeBtnShowMore
} from "../../utils/btn_utils.js";

import {
    findInTableWithTimers,
    setMessageInsideTable
} from "../../utils/table_utils.js";

import {
    changeToDenyInWordTable,
    showCollectionInfo
} from "../../utils/word_table_utils.js";

import {
    Timer
} from "../../classes/timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    getJSONResponseAllLangs
} from "../../api/langs.js";

import {
    getJSONResponseCountOfCollectionsByCustomerIdAndLangCode,
    getJSONResponseFindCollectionByCustomerIdAndKey
} from "../../api/customer_collections.js";

import {
    getGlobalCookie
} from "../../utils/global_cookie_utils.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    compareLangWithCount,
    LangWithCount
} from "../../classes/lang_with_count.js";

import {
    changeEndOfTheWordByNumberOfItems,
    EndOfTheWord
} from "../../classes/end_of_the_word.js";

import {
    WordInCollectionResponseDTO
} from "../../dto/word_in_collection.js";

import {
    LangResponseDTO
} from "../../dto/lang.js";

import {
    LongResponse
} from "../../dto/other/long_response.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _BTN_SHOW_MORE_ID = "btn_show_more";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _COLLECTION_WORD_LIST_CONTAINER_ID = "collection_word_list_container";
const _COLLECTION_WORD_TABLE_HEAD_ID = "collection_word_table_head";
const _COLLECTION_WORD_TABLE_BODY_ID = "collection_word_table_body";
const _DIV_COLLECTIONS_STATISTICS_CONTAINER_ID = "collections_statistics_container";
const _BTN_REFRESH_ID = "btn_refresh";

const _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS = 5;
const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

let _tWaiter = new Timer(null);
let _tFinder = new Timer(null);

window.onload = async function () {
    await prepareCbPartsOfSpeech();
    await prepareCbLangs();
    await prepareCbCustomerCollections();

    let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
    await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

    prepareTbFinder();
    prepareBtnRefresh();

    await tryTofillCollectionWordListTable();
}

function waiter() {
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    setMessageInsideTable(tableHead, tableBody, "Идёт поиск...", true);
}

// Подготовка поля "Поиск"
function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    if (tbFinder != null) {
        tbFinder.addEventListener("input", async function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryTofillCollectionWordListTable);
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
        cbLangs.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryTofillCollectionWordListTable);
        })
    }
}

// Подготовка выпадающего списка "Части речи"
async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbPartsOfSpeech.appendChild(firstOption);

        await fillCbPartsOfSpeech(cbPartsOfSpeech);
        cbPartsOfSpeech.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryTofillCollectionWordListTable);
        })
    }
}

// Подготовка выпадающего списка "Коллекции пользователя"
async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections != null) {
        await fillCbCustomerCollections(cbCustomerCollections);
        cbCustomerCollections.addEventListener("change", async function () {
            let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
            await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryTofillCollectionWordListTable);
        })
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            btnRefresh.disabled = true;
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryTofillCollectionWordListTable);
            btnRefresh.disabled = false;
        })
    }
}

// Подготавливаем GET-запрос и получаем ответ
async function getPreparedJSONResponseAllWordsInCollectionFilteredPagination() {
    let tbFinderValue = document.getElementById(_TB_FINDER_ID).value;
    let cbCustomerCollectionValue = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
    let cbPartsOfSpeechValue = getSelectedOptionId(_CB_PARTS_OF_SPEECH_ID);
    let cbLangCodeValue = getSelectedOptionId(_CB_LANGS_ID);

    return await getJSONResponseAllWordsInCollectionFilteredPagination(tbFinderValue,
        _NUMBER_OF_WORDS, _lastWordInCollectionIdOnPreviousPage, cbCustomerCollectionValue,
        cbPartsOfSpeechValue, cbLangCodeValue);
}

async function tryTofillCollectionWordListTable() {
    _lastWordNumberInList = 0;
    _lastWordInCollectionIdOnPreviousPage = 0n;

    let readyToFill = true;
    let badRequestText = null;

    // Проверяем соответствие коллекции с авторизированным пользователем ---
    let authCustomerId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    let collectionKey = getSelectedOptionId(_CB_CUSTOMER_COLLECTIONS_ID);
    let JSONResponse = await
        getJSONResponseFindCollectionByCustomerIdAndKey(authCustomerId, collectionKey);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        await showCollectionInfo(_DIV_COLLECTION_INFO_ID, collectionKey);
    } else {
        readyToFill = false;

        let message = new CustomResponseMessage(JSONResponse.json);
        badRequestText = message.text;

        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();
    }
    //---

    // Получаем JSON для заполнения таблицы ---
    let allWordsInCollectionFilteredPaginationJson = null;
    if (readyToFill) {
        let JSONResponse = await getPreparedJSONResponseAllWordsInCollectionFilteredPagination();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            allWordsInCollectionFilteredPaginationJson = JSONResponse.json;
        } else {
            readyToFill = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            badRequestText = message.text;
        }
    }
    //---

    // Генерируем статистику по коллекциям, чистим таблицу ---
    await generateCollectionsStatistics();

    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    tableBody.replaceChildren();
    //---

    if (readyToFill) {
        // Заполняем таблицу
        await fillCollectionWordListTable(allWordsInCollectionFilteredPaginationJson);
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        setMessageInsideTable(tableHead, tableBody, badRequestText, true);
    }
}

async function fillCollectionWordListTable(allWordsInCollectionFilteredPaginationJson) {
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        let wordInCollection =
            new WordInCollectionResponseDTO(allWordsInCollectionFilteredPaginationJson[i]);

        // Создаём строку таблицы ---
        let row = document.createElement("tr");
        //---

        // Порядковый номер ---
        let numberColumn = document.createElement("td");
        numberColumn.style.textAlign = "center";
        numberColumn.textContent = `${++_lastWordNumberInList}.`;
        row.appendChild(numberColumn);
        //---

        // Название слова ---
        let titleColumn = document.createElement("td");
        titleColumn.textContent = wordInCollection.word.title;
        row.appendChild(titleColumn);
        //---

        // Язык ---
        let langColumn = document.createElement("td");
        langColumn.appendChild(wordInCollection.word.lang.createSpanLangWithFlag());
        row.appendChild(langColumn);
        //---

        // Часть речи ---
        let partOfSpeechColumn = document.createElement("td");
        partOfSpeechColumn.appendChild(wordInCollection.word.partOfSpeech.createDiv());
        row.appendChild(partOfSpeechColumn);
        //---

        // Действия ---
        let actionColumn = document.createElement("td");
        actionColumn.appendChild(await createBtnAction(wordInCollection.id));
        row.appendChild(actionColumn);
        //---

        // Добавляем строку в таблицу ---
        tableBody.appendChild(row);
        //---

        // Получаем id последнего элемента JSON-коллекции
        if (i === allWordsInCollectionFilteredPaginationJson.length - 1) {
            _lastWordInCollectionIdOnPreviousPage = wordInCollection.id;
        }
    }

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let collectionWordListContainer =
            document.getElementById(_COLLECTION_WORD_LIST_CONTAINER_ID);
        let btnShowMore = createBtnShowMore(_BTN_SHOW_MORE_ID, _NUMBER_OF_WORDS);
        if (collectionWordListContainer != null && btnShowMore != null) {
            btnShowMore.addEventListener("click", async function () {
                let JSONResponse = await getPreparedJSONResponseAllWordsInCollectionFilteredPagination();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    await fillCollectionWordListTable(JSONResponse.json);
                }
            });
            collectionWordListContainer.appendChild(btnShowMore);
        }
    }
}

// Создание кнопки события
async function createBtnAction(wordInCollectionId) {
    let btnAction = createBtnDenyInTable();
    await changeToDenyInWordTable(btnAction, wordInCollectionId);

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(btnAction);

    return divContainer;
}

async function generateCollectionsStatistics() {
    let collectionsStatisticContainer = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
    if (collectionsStatisticContainer != null) {
        // Генерируем статистику по всем коллекциям слов
        let JSONResponseLangs = await getJSONResponseAllLangs();
        if (JSONResponseLangs.status === _HTTP_STATUSES.OK) {
            let langsWithCount = [];
            let numberOfCollectionsSum = 0n;

            // Ищем коллекции пользователя без языка ---
            let langWithoutCode = new LangResponseDTO(null);
            let authId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
            let JSONResponse =
                await getJSONResponseCountOfCollectionsByCustomerIdAndLangCode(authId, langWithoutCode.code);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let longResponse = new LongResponse(JSONResponse.json);
                let numberOfCollections = longResponse.value;
                if (numberOfCollections > 0) {
                    numberOfCollectionsSum += numberOfCollections;

                    let langWithCount =
                        new LangWithCount(langWithoutCode, longResponse.value);
                    langsWithCount.push(langWithCount);
                }
            }
            //---

            // Ищем остальные коллекции пользователя по всем языкам ---
            let json = JSONResponseLangs.json;
            for (let i = 0; i < json.length; i++) {
                let lang = new LangResponseDTO(json[i]);
                let JSONResponse =
                    await getJSONResponseCountOfCollectionsByCustomerIdAndLangCode(authId, lang.code);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let longResponse = new LongResponse(JSONResponse.json);
                    let numberOfCollections = longResponse.value;
                    if (numberOfCollections > 0) {
                        numberOfCollectionsSum += numberOfCollections;

                        let langWithCount =
                            new LangWithCount(lang, numberOfCollections);
                        langsWithCount.push(langWithCount);
                    }
                }
            }
            //---

            // Генерируем статистику по коллекциям пользователя ---
            langsWithCount.sort(compareLangWithCount);

            let mostImportantCollectionsSum = 0n;
            let divStatisticForCollectionsWithLangs = document.createElement("div");
            for (let i = 0; i < langsWithCount.length; i++) {
                let langWithCount = langsWithCount[i];

                if (i !== _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS) {
                    mostImportantCollectionsSum += langWithCount.count;
                } else {
                    break;
                }

                // Создаём основной контейнер ---
                let divLangItem = document.createElement("div");
                //---

                // Флаг ---
                divLangItem.appendChild(langWithCount.lang.createSpanFlag());
                //---

                // Название статуса слова ---
                let aLangTitle = document.createElement("a");
                aLangTitle.textContent = " " + langWithCount.lang.title;
                aLangTitle.style.textDecoration = "underline";
                aLangTitle.style.fontWeight = "bold";

                divLangItem.appendChild(aLangTitle);
                //---

                // Количество коллекций ---
                let spanNumberOfCollections = document.createElement("span");
                spanNumberOfCollections.textContent = `: ${langWithCount.count}`;

                divLangItem.appendChild(spanNumberOfCollections);
                //---

                // Полученный контейнер помещаем в основной ---
                divStatisticForCollectionsWithLangs.appendChild(divLangItem);
                //---
            }
            //---

            // Сумма всех коллекций пользователя ---
            let spanNumberOfCollectionsText = document.createElement("span");
            spanNumberOfCollectionsText.style.fontWeight = "bold";
            spanNumberOfCollectionsText.textContent = "Общее количество ваших коллекций";

            let spanNumberOfCollectionsSum = document.createElement("span");
            spanNumberOfCollectionsSum.textContent = `: ${numberOfCollectionsSum}`;

            let divNumberOfCollectionsSumContainer = document.createElement("div");
            divNumberOfCollectionsSumContainer.appendChild(spanNumberOfCollectionsText);
            divNumberOfCollectionsSumContainer.appendChild(spanNumberOfCollectionsSum);
            //---

            // Если коллекций на различных языках больше, чем заявленный максимум, отображаем специальное сообщение ---
            let divOtherCollectionsSumContainer = document.createElement("div");
            let otherCollectionsSum = numberOfCollectionsSum - mostImportantCollectionsSum;
            if (otherCollectionsSum > 0) {
                let collectionsWord = changeEndOfTheWordByNumberOfItems("коллекция", otherCollectionsSum,
                    new EndOfTheWord("й", 1),
                    new EndOfTheWord("и", 1),
                    null,
                    new EndOfTheWord("й", 1));

                let otherLangs = langsWithCount.length - _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS;
                let langsWord = changeEndOfTheWordByNumberOfItems("язык", otherCollectionsSum,
                    new EndOfTheWord("ах", 0),
                    new EndOfTheWord("ах", 0),
                    new EndOfTheWord("е", 0),
                    new EndOfTheWord("ах", 0));

                let spanOtherCollectionsSum = document.createElement("span");
                spanOtherCollectionsSum.style.fontWeight = "bold";
                spanOtherCollectionsSum.textContent = `...и ещё ${otherCollectionsSum} ${collectionsWord} на 
                    ${otherLangs} ${langsWord}.`;
                divOtherCollectionsSumContainer.appendChild(spanOtherCollectionsSum);
            }
            //---

            // Добавляем элементы в основной контейнер ---
            collectionsStatisticContainer.replaceChildren();
            collectionsStatisticContainer.appendChild(divNumberOfCollectionsSumContainer);
            collectionsStatisticContainer.appendChild(divStatisticForCollectionsWithLangs);
            collectionsStatisticContainer.appendChild(divOtherCollectionsSumContainer);
            collectionsStatisticContainer.appendChild(document.createElement("br"));
            //---
        }
    }
}

