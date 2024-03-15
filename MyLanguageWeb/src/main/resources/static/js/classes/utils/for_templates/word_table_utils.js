import {
    WordInCollectionResponseDTO
} from "../../dto/entity/word_in_collection.js";

import {
    WordsInCollectionAPI
} from "../../api/words_in_collection_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    AButtons
} from "../../a_buttons/a_buttons.js";

import {
    AButtonImgSizes
} from "../../a_buttons/a_button_img_sizes.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _A_BUTTONS = new AButtons();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

export class WordTableUtils {
    async changeToAddAction(aBtnActionElement, wordInCollectionRequestDTO) {
        let aButtonImgSize =  _A_BUTTON_IMG_SIZES.SIZE_16;
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement, aButtonImgSize);
        aBtnActionElement.onclick = null;

        _A_BUTTONS.A_BUTTON_ACCEPT.setStyles(aBtnActionElement, aButtonImgSize);
        aBtnActionElement.title = "Добавить слово в коллекцию";

        aBtnActionElement.onclick = async function () {
            let JSONResponse = await _WORDS_IN_COLLECTION_API.POST.add(wordInCollectionRequestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);
                wordInCollectionRequestDTO.id = wordInCollection.id;
                wordInCollectionRequestDTO.wordId = wordInCollection.word.id;
                wordInCollectionRequestDTO.collectionId = wordInCollection.customerCollection.id;

                let wordTableUtils = new WordTableUtils();
                await wordTableUtils.changeToRemoveAction(aBtnActionElement, wordInCollectionRequestDTO);
            } else {
                _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement, aButtonImgSize);
                aBtnActionElement.onclick = null;
            }
        }
    }

    async changeToRemoveAction(aBtnActionElement, wordInCollectionRequestDTO) {
        let aButtonImgSize =  _A_BUTTON_IMG_SIZES.SIZE_16;
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement, aButtonImgSize);
        aBtnActionElement.onclick = null;

        _A_BUTTONS.A_BUTTON_DENY.setStyles(aBtnActionElement, aButtonImgSize);
        aBtnActionElement.title = "Удалить слово из коллекции";

        aBtnActionElement.onclick = async function() {
            let JSONResponse = await _WORDS_IN_COLLECTION_API.DELETE.delete(wordInCollectionRequestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let wordTableUtils = new WordTableUtils();
                await wordTableUtils.changeToAddAction(aBtnActionElement, wordInCollectionRequestDTO);
            } else {
                _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnActionElement, aButtonImgSize);
                aBtnActionElement.onclick = null;
            }
        }
    }
}