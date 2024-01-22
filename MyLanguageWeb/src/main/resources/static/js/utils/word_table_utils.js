import {
    buildABtnAcceptInTable,
    buildABtnDenyInTable, buildABtnDisabledInTable
} from "./btn_utils.js";

import {
    deleteJSONResponseDeleteWordInCollection,
    postJSONResponseAddWordInCollection
} from "../api/words_in_collection.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    WordInCollectionResponseDTO
} from "../dto/word_in_collection.js";

const _HTTP_STATUSES = new HttpStatuses();

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