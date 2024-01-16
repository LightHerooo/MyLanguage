import {
    buildABtnAcceptInTable,
    buildABtnDenyInTable, buildABtnDisabledInTable
} from "./btn_utils.js";

import {
    deleteJSONResponseDeleteWordInCollection,
    getJSONResponseCountOfWordsInCollectionByCollectionKey,
    postJSONResponseAddWordInCollection
} from "../api/words_in_collection.js";

import {
    getJSONResponseFindCollectionByKey
} from "../api/customer_collections.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    CssMain
} from "../classes/css/css_main.js";

import {
    createSpanLangWithFlag,
    setFlag
} from "./flag_icons_utils.js";

import {
    DateElements
} from "./date_elements.js";

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();

const _COLLECTION_INFO_CONTAINER_STYLE_ID = "collection-info-container";
const _COLLECTION_INFO_CONTAINER_LEFT_STYLE_ID = "collection-info-container-left";
const _COLLECTION_INFO_IMG_STYLE_ID = "collection-info-img";
const _COLLECTION_INFO_CONTAINER_RIGHT_STYLE_ID = "collection-info-container-right";
const _COLLECTION_INFO_TEXT_HEADER_STYLE_ID = "collection-info-text-header";
const _COLLECTION_INFO_TEXT_STYLE_ID = "collection-info-text";

// Смена события на добавление
export async function changeToAcceptInWordTable(btnActionElement, collectionKey, wordId) {
    buildABtnDisabledInTable(btnActionElement);
    btnActionElement.onclick = null;

    buildABtnAcceptInTable(btnActionElement, true);
    btnActionElement.title = "Добавить слово в коллекцию";
    btnActionElement.onclick = async function () {
        let JSONResponse = await postJSONResponseAddWordInCollection(
            wordId, collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            let wordInCollectionId = json["id"];
            await changeToDenyInWordTable(btnActionElement, wordInCollectionId);
        }
    }
}

// Смена события на удаление
export async function changeToDenyInWordTable(btnActionElement, wordInCollectionId) {
    buildABtnDisabledInTable(btnActionElement);
    btnActionElement.onclick = null;

    buildABtnDenyInTable(btnActionElement, true);
    btnActionElement.title = "Удалить слово из коллекции";
    btnActionElement.onclick = async function() {
        let JSONResponse = await deleteJSONResponseDeleteWordInCollection(wordInCollectionId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let json = JSONResponse.json;
            let wordId = json["word"]["id"];
            let collectionKey = json["customer_collection"]["key"];
            await changeToAcceptInWordTable(btnActionElement, collectionKey, wordId);
        }
    }
}

// Отображение информации о коллекции
export async function showCollectionInfo(parentContainerId, collectionKey) {
    // Создаём основной контейнер с информацией о коллекции
    const COLLECTION_INFO_CONTAINER_ID = "collection_info_container";
    let collectionInfoContainer = document.getElementById(COLLECTION_INFO_CONTAINER_ID);
    if (collectionInfoContainer == null) {
        collectionInfoContainer = document.createElement("div");
        collectionInfoContainer.id = COLLECTION_INFO_CONTAINER_ID;
        collectionInfoContainer.classList.add(_CSS_MAIN.DIV_BLOCK_INFO_STANDARD_STYLE_ID);
        collectionInfoContainer.classList.add(_COLLECTION_INFO_CONTAINER_STYLE_ID);
    }

    let JSONResponse = await getJSONResponseFindCollectionByKey(collectionKey);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let jsonCustomerCollection = JSONResponse.json;

        // Добавляем основной контейнер на страницу
        let divCollectionInfo = document.getElementById(parentContainerId);
        if (divCollectionInfo != null) {
            divCollectionInfo.appendChild(collectionInfoContainer);
        }

        // Очищаем информацию о коллекции (при условии, что до этого она была)
        collectionInfoContainer.replaceChildren();

        JSONResponse = await getJSONResponseCountOfWordsInCollectionByCollectionKey(collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            // Получаем количество слов ---
            let countOfWordsInCollection = JSONResponse.json["count_of_words_in_collection"];
            //---

            // Информация о языке ---
            let lang = jsonCustomerCollection["lang"];
            let langCode = null;
            if (lang) {
                langCode = lang["code"];
            }
            //---

            // Название коллекции (с флагом) ---
            let spanFlag = document.createElement("span");
            setFlag(spanFlag, langCode);

            let spanCollectionTitle = document.createElement("span");
            spanCollectionTitle.textContent = " " + jsonCustomerCollection["title"];

            let divCollectionName = document.createElement("div");
            divCollectionName.classList.add(_COLLECTION_INFO_TEXT_HEADER_STYLE_ID);
            divCollectionName.appendChild(spanFlag);
            divCollectionName.appendChild(spanCollectionTitle);
            //---

            // Дата создания ---
            let dateOfCreate = new Date(jsonCustomerCollection["date_of_create"]);
            let dateOfCreateElements = new DateElements(dateOfCreate);

            let divCollectionDateOfCreate = document.createElement("div");
            divCollectionDateOfCreate.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
            divCollectionDateOfCreate.textContent = `Дата создания: ${dateOfCreateElements.getDateStr()}`;
            //---

            // Язык ---
            let spanLangInfo = document.createElement("span");
            spanLangInfo.textContent = "Язык: ";

            let spanFlagWithTitle = createSpanLangWithFlag(lang);

            let divCollectionLang = document.createElement("div");
            divCollectionLang.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
            divCollectionLang.appendChild(spanLangInfo);
            divCollectionLang.appendChild(spanFlagWithTitle);
            //---

            let divCollectionNumberOfWords = document.createElement("div");
            divCollectionNumberOfWords.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
            divCollectionNumberOfWords.textContent = `Количество слов: ${countOfWordsInCollection}`;

            let divCollectionKey = document.createElement("div");
            divCollectionKey.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
            divCollectionKey.textContent = `Ключ: ${jsonCustomerCollection["key"]}`;
            //---

            // Генерируем правый контейнер ---
            let collectionInfoContainerRight = document.createElement("div");
            collectionInfoContainerRight.classList.add(_COLLECTION_INFO_CONTAINER_RIGHT_STYLE_ID);

            collectionInfoContainerRight.appendChild(divCollectionName);
            collectionInfoContainerRight.appendChild(document.createElement("br"));
            collectionInfoContainerRight.appendChild(divCollectionDateOfCreate);
            collectionInfoContainerRight.appendChild(divCollectionLang);
            collectionInfoContainerRight.appendChild(divCollectionNumberOfWords);
            collectionInfoContainerRight.appendChild(divCollectionKey);
            //---

            // Генерируем изображение ---
            let collectionInfoImg = document.createElement("img");
            collectionInfoImg.classList.add(_COLLECTION_INFO_IMG_STYLE_ID);
            collectionInfoImg.src = "/images/books.png";
            //---

            //Генерируем левый контейнер ---
            let collectionInfoContainerLeft = document.createElement("div");
            collectionInfoContainerLeft.classList.add(_COLLECTION_INFO_CONTAINER_LEFT_STYLE_ID);

            collectionInfoContainerLeft.appendChild(collectionInfoImg);
            //---

            // Добавляем элементы в основной контейнер ---
            collectionInfoContainer.appendChild(collectionInfoContainerLeft);
            collectionInfoContainer.appendChild(collectionInfoContainerRight);
            //---
        }
    } else {
        if (collectionInfoContainer.parentNode != null) {
            collectionInfoContainer.parentNode.removeChild(collectionInfoContainer);
        }
    }
}