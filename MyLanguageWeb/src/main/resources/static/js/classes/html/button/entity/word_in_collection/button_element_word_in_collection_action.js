import {
    ButtonWithImgElementTypes
} from "../../with_img/button_with_img_element_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    WordsInCollectionAPI
} from "../../../../api/entity/words_in_collection_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ButtonWithImgElement
} from "../../with_img/button_with_img_element.js";

import {
    WordInCollectionResponseDTO
} from "../../../../dto/entity/word_in_collection/response/word_in_collection_response_dto.js";

import {
    EntityIdRequestDTO
} from "../../../../dto/other/request/entity/entity_id_request_dto.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class ButtonElementWordInCollectionAction extends ButtonWithImgElement {
    #wordInCollectionAddRequestDTO;

    constructor(button, img) {
        super(button, img);
    }

    setWordInCollectionAddRequestDTO(wordInCollectionAddRequestDTOObj) {
        this.#wordInCollectionAddRequestDTO = wordInCollectionAddRequestDTOObj;
    }


    #checkCorrectValuesBeforeChange() {
        let isCorrect = true;

        let wordInCollectionAddRequestDTO = this.#wordInCollectionAddRequestDTO;
        if (!wordInCollectionAddRequestDTO) {
            isCorrect = false;
            this.changeDisabledStatus(true);
            this.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DEFAULT);
            this.changeTitle("Слово из коллекции не установлено");
        }

        return isCorrect;
    }

    async changeToAdd() {
        let isCorrect = this.#checkCorrectValuesBeforeChange();
        if (isCorrect) {
            this.changeDisabledStatus(true);
            this.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ADD);
            this.changeTitle("Добавить слово в коллекцию");

            let wordInCollectionAddRequestDTO = this.#wordInCollectionAddRequestDTO;
            if (wordInCollectionAddRequestDTO) {
                let jsonResponse = await _WORDS_IN_COLLECTION_API.POST.validateBeforeAdd(wordInCollectionAddRequestDTO);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let button = this.getButton();
                    if (button) {
                        let self = this;
                        button.onclick = async function () {
                            self.changeDisabledStatus(true);

                            let jsonResponse = await _WORDS_IN_COLLECTION_API.POST.add(wordInCollectionAddRequestDTO);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                let wordInCollection = new WordInCollectionResponseDTO(jsonResponse.getJson());
                                wordInCollectionAddRequestDTO.setId(wordInCollection.getId());

                                let word = wordInCollection.getWord();
                                if (wordInCollection) {
                                    wordInCollectionAddRequestDTO.setWordId(word.getId());
                                }

                                let customerCollection = wordInCollection.getCustomerCollection();
                                if (customerCollection) {
                                    wordInCollectionAddRequestDTO.setCustomerCollectionId(customerCollection.getId());
                                }

                                await self.changeToDelete();
                            } else {
                                this.changeTitle(new ResponseMessageResponseDTO(
                                    jsonResponse.getJson()).getMessage());
                                button.onclick = null;
                            }
                        };

                        this.changeDisabledStatus(false);
                    }
                } else {
                    this.changeDisabledStatus(true);
                    this.changeTitle(new ResponseMessageResponseDTO(
                        jsonResponse.getJson()).getMessage());

                    let button = this.getButton();
                    if (button) {
                        button.onclick = null;
                    }
                }
            }
        }
    }

    async changeToDelete() {
        let isCorrect = this.#checkCorrectValuesBeforeChange();
        if (isCorrect) {
            this.changeDisabledStatus(true);
            this.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DELETE);
            this.changeTitle("Удалить слово из коллекцию");

            let wordInCollectionAddRequestDTO = this.#wordInCollectionAddRequestDTO;
            if (wordInCollectionAddRequestDTO) {
                let entityIdRequestDTO = new EntityIdRequestDTO();
                entityIdRequestDTO.setId(wordInCollectionAddRequestDTO.getId());

                let jsonResponse = await _WORDS_IN_COLLECTION_API.POST.validateBeforeDelete(entityIdRequestDTO);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let button = this.getButton();
                    if (button) {
                        let self = this;
                        button.onclick = async function() {
                            self.changeDisabledStatus(true);

                            if (wordInCollectionAddRequestDTO) {
                                let jsonResponse = await _WORDS_IN_COLLECTION_API.DELETE.delete(entityIdRequestDTO);
                                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                    await self.changeToAdd();
                                } else {
                                    this.changeTitle(new ResponseMessageResponseDTO(
                                        jsonResponse.getJson()).getMessage());
                                    button.onclick = null;
                                }
                            }
                        };

                        this.changeDisabledStatus(false);
                    }
                } else {
                    this.changeDisabledStatus(true);
                    this.changeTitle(new ResponseMessageResponseDTO(
                        jsonResponse.getJson()).getMessage());

                    let button = this.getButton();
                    if (button) {
                        button.onclick = null;
                    }
                }
            }
        }
    }

    changeToDisabled(title) {
        let isCorrect = this.#checkCorrectValuesBeforeChange();
        if (isCorrect) {
            this.changeDisabledStatus(true);
            this.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DEFAULT);
            this.changeTitle(title);
        }
    }
}