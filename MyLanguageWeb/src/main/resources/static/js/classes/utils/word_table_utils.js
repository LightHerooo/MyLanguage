import {
    WordInCollectionRequestDTO,
    WordInCollectionResponseDTO
} from "../dto/word_in_collection.js";

import {
    WordsInCollectionAPI
} from "../api/words_in_collection_api.js";

import {
    HttpStatuses
} from "../http_statuses.js";

import {
    AButtons
} from "../a_buttons.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _A_BUTTONS = new AButtons();

export class WordTableUtils {
    async changeToAddAction(aBtnActionElement, collectionKey, wordId) {
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement);
        aBtnActionElement.onclick = null;

        // Формируем DTO для добавления слова ---
        let wordInCollectionRequestDTO = new WordInCollectionRequestDTO();
        wordInCollectionRequestDTO.wordId = wordId;
        wordInCollectionRequestDTO.collectionKey = collectionKey;
        //---

        _A_BUTTONS.A_BUTTON_ACCEPT.setStyles(aBtnActionElement, true);
        aBtnActionElement.title = "Добавить слово в коллекцию";

        aBtnActionElement.onclick = async function () {
            let JSONResponse = await _WORDS_IN_COLLECTION_API.POST.add(wordInCollectionRequestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);

                let wordTableUtils = new WordTableUtils();
                await wordTableUtils.changeToRemoveAction(aBtnActionElement, wordInCollection.id);
            } else {
                _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement);
                aBtnActionElement.onclick = null;
            }
        }
    }

    async changeToRemoveAction(aBtnActionElement, wordInCollectionId) {
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement);
        aBtnActionElement.onclick = null;

        // Формируем DTO для удаления слова ---
        let wordInCollectionRequestDTO = new WordInCollectionRequestDTO();
        wordInCollectionRequestDTO.id = wordInCollectionId;
        //---

        _A_BUTTONS.A_BUTTON_DENY.setStyles(aBtnActionElement, true);
        aBtnActionElement.title = "Удалить слово из коллекции";

        aBtnActionElement.onclick = async function() {
            let JSONResponse = await _WORDS_IN_COLLECTION_API.DELETE.delete(wordInCollectionRequestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);

                let wordTableUtils = new WordTableUtils();
                await wordTableUtils.changeToAddAction(aBtnActionElement,
                    wordInCollection.customerCollection.key, wordInCollection.word.id);
            } else {
                _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement);
                aBtnActionElement.onclick = null;
            }
        }
    }
}