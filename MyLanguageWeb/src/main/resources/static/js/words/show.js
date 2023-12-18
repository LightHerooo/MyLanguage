import {OK} from "../utils/http_statuses.js";

import { URL_TO_API_WORDS_FILTERED_PAGINATION } from "../api/words.js";
import { URL_TO_API_PARTS_OF_SPEECH } from "../api/parts_of_speech.js";
import { URL_TO_API_LANGS } from "../api/langs.js";

import { A_BUTTON_STANDARD } from "../css/css_main_classes.js";

const _CSS_A_SHOW_MORE = "a-show-more";

const _TB_FINDER_ID = "tb_finder";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _CB_LANGS_ID = "cb_langs";
const _WORDS_TABLE_HEAD_ID = "words_table_head";
const _WORDS_TABLE_BODY_ID = "words_table_body";
const _WORD_LIST_CONTAINER_ID = "word_list_container";
const _BTN_SHOW_MORE = "btn_show_more";

const _NUMBER_OF_WORDS = 20;

let _lastWordIdOnPreviousPage = 0;
let _lastWordNumberInList = 0;

// Загружаем скрипты на страницу
window.onload = function () {
    prepareTbFinder();
    prepareCbPartOfSpeech();
    prepareLangSelect();
    fillWordsTableWithClean();
}

// Подготовка поля "Поиск"
function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    // Вешаем событие обновления списка при изменении текста
    tbFinder.addEventListener("input", function () {
        fillWordsTableWithClean();
    })
}

// Подготовка выпадающего списка "Части речи"
function prepareCbPartOfSpeech() {
    let requestURL = new URL(URL_TO_API_PARTS_OF_SPEECH);

    // Отправляем запрос на сервер
    let xml = new XMLHttpRequest();
    xml.open("GET", requestURL);
    xml.responseType = "json";
    xml.send();

    // Получаем JSON
    xml.onload = function () {
        let cbPartOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        firstOption.value = "";
        cbPartOfSpeech.appendChild(firstOption);

        let responseJSON = xml.response;
        if (xml.status === OK) {
            for (let i = 0; i < responseJSON.length; i++) {
                let jsonItem = responseJSON[i];

                let option = document.createElement("option");
                option.textContent = jsonItem["title"];
                option.value = jsonItem["code"];

                cbPartOfSpeech.appendChild(option);
            }

            // Вешаем событие обновления списка при изменении элемента выпадающего списка
            cbPartOfSpeech.addEventListener("change", function () {
                fillWordsTableWithClean();
            })
        }
    }
}

// Подготовка выпадающего списка "Языки"
function prepareLangSelect() {
    let requestURL = new URL(URL_TO_API_LANGS);

    // Отправляем запрос на сервер
    let xml = new XMLHttpRequest();
    xml.open("GET", requestURL);
    xml.responseType = "json";
    xml.send();

    // Получаем JSON
    xml.onload = function () {
        let cbLangs = document.getElementById(_CB_LANGS_ID);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        firstOption.value = "";
        cbLangs.appendChild(firstOption);

        let responseJSON = xml.response;
        if (xml.status === OK) {
            for (let i = 0; i < responseJSON.length; i++) {
                let jsonItem = responseJSON[i];

                let option = document.createElement("option");
                option.textContent = jsonItem["title"];
                option.value = jsonItem["code"];

                cbLangs.appendChild(option);
            }

            // Вешаем событие обновления списка при изменении элемента выпадающего списка
            cbLangs.addEventListener("change", function () {
                fillWordsTableWithClean();
            })
        }
    }
}

// Получение сформированного GET-запроса к API для получения слов
function getPreparedXmlForFilteredWordsWithPagination() {

    let finderText = document.getElementById(_TB_FINDER_ID).value;
    let partOfSpeechCode = document.getElementById(_CB_PARTS_OF_SPEECH_ID).value;
    let langCode = document.getElementById(_CB_LANGS_ID).value;

    // Генерируем строку запроса с параметрами
    let requestURL = new URL(URL_TO_API_WORDS_FILTERED_PAGINATION);
    requestURL.searchParams.set("title", finderText);
    requestURL.searchParams.set("word_status_code", "enable");
    requestURL.searchParams.set("number_of_words", _NUMBER_OF_WORDS);
    requestURL.searchParams.set("last_word_id_on_previous_page", _lastWordIdOnPreviousPage);
    if (partOfSpeechCode) {
        requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);
    }
    if (langCode) {
        requestURL.searchParams.set("lang_code", langCode);
    }

    // Подготавливаем запрос
    let xml = new XMLHttpRequest();
    xml.open("GET", requestURL);
    xml.responseType = "json";
    return xml;
}

// Заполнение таблицы с предварительной очисткой
function fillWordsTableWithClean() {
    _lastWordIdOnPreviousPage = 0;
    _lastWordNumberInList = 0;

    removeBtnShowMore();
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    tableBody.replaceChildren();
    fillWordsTable();
}

// Заполнение таблицы
function fillWordsTable() {
    // Получаем JSON со словами (с фильтрацией)
    let xml = getPreparedXmlForFilteredWordsWithPagination();
    xml.onload = function () {
        let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);

        let responseJSON = xml.response;
        if (xml.status === OK) {
            // Заполняем таблицу
            for (let i = 0; i < responseJSON.length; i++) {
                let row = document.createElement("tr");

                let item = responseJSON[i];
                let numberColumn = document.createElement("td");
                let titleColumn = document.createElement("td");
                let languageColumn = document.createElement("td");
                let pathOfSpeechColumn = document.createElement("td");

                numberColumn.textContent = `${++_lastWordNumberInList}.`;
                numberColumn.style.textAlign = "center";
                titleColumn.textContent = item["title"];
                languageColumn.textContent = item["lang"]["title"];
                pathOfSpeechColumn.textContent = item["partOfSpeech"]["title"];

                row.appendChild(numberColumn);
                row.appendChild(titleColumn);
                row.appendChild(languageColumn);
                row.appendChild(pathOfSpeechColumn);

                tableBody.appendChild(row);

                // Получаем id последнего элемента JSON-коллекции
                if (i === responseJSON.length - 1) {
                    _lastWordIdOnPreviousPage = item["id"];
                }
            }

            // Создаем кнопку, только если запрос вернул максимальное количество на страницу
            if (responseJSON.length === _NUMBER_OF_WORDS) {
                createBtnShowMore();
            }
        } else {
            if (tableBody.children.length === 0) {
                let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
                if (tableHead != null) {
                    let trTableHead = tableHead.children.item(0);
                    if (trTableHead != null) {
                        let trMessage = document.createElement("tr");
                        let tdMessage = document.createElement("td");
                        tdMessage.colSpan = trTableHead.childElementCount;
                        tdMessage.style.textAlign = "center";
                        tdMessage.textContent = responseJSON["text"];

                        trMessage.appendChild(tdMessage);
                        tableBody.appendChild(trMessage);
                    }
                }
            }
        }
    }

    xml.send();
}

// Создание кнопки "Показать больше..."
function createBtnShowMore() {
    // Создаём кнопку тега "а", привязываем класс, чтобы применить стили
    let btnShowMore = document.createElement("a");
    btnShowMore.id = _BTN_SHOW_MORE;
    btnShowMore.classList.add(A_BUTTON_STANDARD);
    btnShowMore.classList.add(_CSS_A_SHOW_MORE);
    btnShowMore.text = `Показать ещё ${_NUMBER_OF_WORDS} элементов...`;
    btnShowMore.addEventListener("click", function () {
        removeBtnShowMore();
        fillWordsTable();
    });

    let wordListContainer = document.getElementById(_WORD_LIST_CONTAINER_ID);
    wordListContainer.appendChild(btnShowMore);
}

// Удаление кнопки "Показать больше..."
function removeBtnShowMore() {
    let oldBtnShowMore = document.getElementById(_BTN_SHOW_MORE);
    if (oldBtnShowMore != null) {
        oldBtnShowMore.parentNode.removeChild(oldBtnShowMore);
    }
}
