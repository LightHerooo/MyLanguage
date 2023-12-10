import { URL_TO_API_WORDS_FILTERED_PAGINATION } from "./api/words.js";
import { URL_TO_API_PARTS_OF_SPEECH } from "./api/parts_of_speech.js";
import { URL_TO_API_LANGS } from "./api/langs.js";
import { A_BUTTON_STANDARD } from "./css/main_css_variables.js";

let _aShowMoreClass = "a-show-more";

let _tbFinderId = "tb_finder";
let _cbPartsOfSpeechId = "cb_parts_of_speech";
let _cbLangsId = "cb_langs";
let _allWordsTableBodyId = "all_words_table_body";
let _wordListContainerId = "word_list_container";
let _btnShowMoreId = "btn_show_more";

let _numberOfWords = 20;
let _lastWordIdBeforeFilter = 0;
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
    let tbFinder = document.getElementById(_tbFinderId);
    console.log(tbFinder.value);

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
        let json = xml.response;
        let cbPartOfSpeech = document.getElementById(_cbPartsOfSpeechId);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        firstOption.value = "";
        cbPartOfSpeech.appendChild(firstOption);

        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

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
        let json = xml.response;
        let cbLangs = document.getElementById(_cbLangsId);

        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        firstOption.value = "";
        cbLangs.appendChild(firstOption);

        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

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

// Получение сформированного GET-запроса к API для получения слов
function getPreparedXmlForFilteredWordsWithPagination() {

    let finderText = document.getElementById(_tbFinderId).value;
    let partOfSpeechCode = document.getElementById(_cbPartsOfSpeechId).value;
    let langCode = document.getElementById(_cbLangsId).value;

    // Генерируем строку запроса с параметрами
    let requestURL = new URL(URL_TO_API_WORDS_FILTERED_PAGINATION);
    requestURL.searchParams.set("title", finderText);
    requestURL.searchParams.set("word_status_code", "enable");
    requestURL.searchParams.set("number_of_words", _numberOfWords);
    requestURL.searchParams.set("last_word_id_before_filter", _lastWordIdBeforeFilter);
    if (partOfSpeechCode) {
        requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);
    }
    if (langCode) {
        requestURL.searchParams.set("lang_code", langCode);
    }

    // Отправляем запрос на сервер
    let xml = new XMLHttpRequest();
    xml.open("GET", requestURL);
    xml.responseType = "json";
    return xml;
}

// Заполнение таблицы с предварительной очисткой
function fillWordsTableWithClean() {
    _lastWordIdBeforeFilter = 0;
    _lastWordNumberInList = 0;

    let tableBody = document.getElementById(_allWordsTableBodyId);
    tableBody.replaceChildren();
    fillWordsTable();
}

// Заполнение таблицы
function fillWordsTable() {
    // Получаем JSON со словами (с фильтрацией)
    let preparedXml = getPreparedXmlForFilteredWordsWithPagination();
    preparedXml.onload = function () {
        let wordsJSON = preparedXml.response;

        if (wordsJSON.length > 0) {
            // Заполняем таблицу
            let tableBody = document.getElementById(_allWordsTableBodyId)
            for (let i = 0; i < wordsJSON.length; i++) {
                let row = document.createElement("tr");

                let item = wordsJSON[i];
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
                if (i === wordsJSON.length - 1) {
                    _lastWordIdBeforeFilter = item["id"];
                }
            }
            createBtnShowMore();
        }
    }

    preparedXml.send();
}

function createBtnShowMore() {
    // Удаляем предыдущую кнопку во избежание дублирования
    removeBtnShowMore();

    // Создаём кнопку тега "а", привязываем класс, чтобы применить стили
    let btnShowMore = document.createElement("a");
    btnShowMore.id = _btnShowMoreId;
    btnShowMore.classList.add(A_BUTTON_STANDARD);
    btnShowMore.classList.add(_aShowMoreClass);
    btnShowMore.text = `Показать ещё ${_numberOfWords} элементов...`;
    btnShowMore.addEventListener("click", function () {
        removeBtnShowMore();
        fillWordsTable();
    });

    let wordListContainer = document.getElementById(_wordListContainerId);
    wordListContainer.appendChild(btnShowMore);
}

function removeBtnShowMore() {
    let oldBtnShowMore = document.getElementById(_btnShowMoreId);
    if (oldBtnShowMore != null) {
        oldBtnShowMore.parentNode.removeChild(oldBtnShowMore);
    }
}
