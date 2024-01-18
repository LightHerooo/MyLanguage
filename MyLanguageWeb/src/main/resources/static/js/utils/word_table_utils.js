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
    DateElements
} from "./date_elements.js";

import {
    CustomerCollectionResponseDTO
} from "../dto/customer_collection.js";

import {
    LongResponse
} from "../dto/other/long_response.js";

import {
    WordInCollectionResponseDTO
} from "../dto/word_in_collection.js";

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
            let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);
            await changeToDenyInWordTable(btnActionElement, wordInCollection.id);
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
            let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);
            await changeToAcceptInWordTable(btnActionElement,
                wordInCollection.customerCollection.key, wordInCollection.word.id);
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
        let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);

        // Добавляем основной контейнер на страницу
        let divCollectionInfo = document.getElementById(parentContainerId);
        if (divCollectionInfo != null) {
            divCollectionInfo.appendChild(collectionInfoContainer);
        }

        // Очищаем информацию о коллекции (при условии, что до этого она была) ---
        collectionInfoContainer.replaceChildren();
        //---

        // Генерируем правый контейнер ---
        let collectionInfoContainerRight = document.createElement("div");
        collectionInfoContainerRight.classList.add(_COLLECTION_INFO_CONTAINER_RIGHT_STYLE_ID);
        //---

        // Название коллекции (с флагом) ---
        let spanCollectionTitle = document.createElement("span");
        spanCollectionTitle.textContent = " " + customerCollection.title;

        let divCollectionName = document.createElement("div");
        divCollectionName.classList.add(_COLLECTION_INFO_TEXT_HEADER_STYLE_ID);
        divCollectionName.appendChild(customerCollection.lang.createSpanFlag());
        divCollectionName.appendChild(spanCollectionTitle);

        collectionInfoContainerRight.appendChild(divCollectionName);
        collectionInfoContainerRight.appendChild(document.createElement("br"));
        //---

        // Дата создания ---
        let dateOfCreate = new Date(customerCollection.dateOfCreate);
        let dateOfCreateElements = new DateElements(dateOfCreate);

        let divCollectionDateOfCreate = document.createElement("div");
        divCollectionDateOfCreate.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
        divCollectionDateOfCreate.textContent = `Дата создания: ${dateOfCreateElements.getDateStr()}`;

        collectionInfoContainerRight.appendChild(divCollectionDateOfCreate);
        //---

        // Язык ---
        let spanLangInfo = document.createElement("span");
        spanLangInfo.textContent = "Язык: ";

        let divCollectionLang = document.createElement("div");
        divCollectionLang.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
        divCollectionLang.appendChild(spanLangInfo);
        divCollectionLang.appendChild(customerCollection.lang.createSpanLangWithFlag());

        collectionInfoContainerRight.appendChild(divCollectionLang);
        //---

        // Количество слов в коллекции ---
        JSONResponse = await getJSONResponseCountOfWordsInCollectionByCollectionKey(collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let longResponse = new LongResponse(JSONResponse.json);

            let divCollectionNumberOfWords = document.createElement("div");
            divCollectionNumberOfWords.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
            divCollectionNumberOfWords.textContent = `Количество слов: ${longResponse.value}`;

            collectionInfoContainerRight.appendChild(divCollectionNumberOfWords);
        }
        //---

        // Ключ ---
        let divCollectionKey = document.createElement("div");
        divCollectionKey.classList.add(_COLLECTION_INFO_TEXT_STYLE_ID);
        divCollectionKey.textContent = `Ключ: ${customerCollection.key}`;
        collectionInfoContainerRight.appendChild(divCollectionKey);
        //---

        //Генерируем левый контейнер ---
        let collectionInfoContainerLeft = document.createElement("div");
        collectionInfoContainerLeft.classList.add(_COLLECTION_INFO_CONTAINER_LEFT_STYLE_ID);
        //---

        // Генерируем изображение ---
        let collectionInfoImg = document.createElement("img");
        collectionInfoImg.classList.add(_COLLECTION_INFO_IMG_STYLE_ID);
        collectionInfoImg.src = "/images/books.png";

        collectionInfoContainerLeft.appendChild(collectionInfoImg);
        //---

        // Добавляем элементы в основной контейнер ---
        collectionInfoContainer.appendChild(collectionInfoContainerLeft);
        collectionInfoContainer.appendChild(collectionInfoContainerRight);
        //---
    } else {
        if (collectionInfoContainer.parentNode != null) {
            collectionInfoContainer.parentNode.removeChild(collectionInfoContainer);
        }
    }
}