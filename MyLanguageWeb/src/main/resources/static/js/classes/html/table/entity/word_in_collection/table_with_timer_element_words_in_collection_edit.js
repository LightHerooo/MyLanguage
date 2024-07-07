import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    WordsInCollectionAPI
} from "../../../../api/entity/words_in_collection_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    WordInCollectionResponseDTO
} from "../../../../dto/entity/word_in_collection/response/word_in_collection_response_dto.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    CssDivElement
} from "../../../../css/elements/div/css_div_element.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();

export class TableWithTimerElementWordsInCollectionEdit extends TableWithTimerAbstractElement {
    #buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete;
    #buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete;
    #inputTextElementFinder;
    #buttonElementRefresh;
    #customerCollectionId;

    #maxNumberOfWordsOnPage = 20;
    #doNeedToDeleteAllWords = false;
    #excludedWordInCollectionIds = new Set();

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setButtonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete(buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDeleteObj) {
        this.#buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete =
            buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDeleteObj;
    }

    setButtonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete(buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDeleteObj) {
        this.#buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete =
            buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDeleteObj;
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }

    getDoNeedToDeleteAllWords() {
        return this.#doNeedToDeleteAllWords;
    }

    getExcludedWordInCollectionIdsArr() {
        let array;

        let excludedWordInCollectionIds = this.#excludedWordInCollectionIds;
        if (excludedWordInCollectionIds && excludedWordInCollectionIds.size > 0) {
            array = Array.from(excludedWordInCollectionIds);
        }

        return array;
    }


    async #createTr(wordInCollectionResponseDTOObj) {
        let tr;
        if (wordInCollectionResponseDTOObj) {
            tr = document.createElement("tr");

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Название слова ---
            td = document.createElement("td");

            let word = wordInCollectionResponseDTOObj.getWord();
            if (word) {
                td.textContent = word.getTitle();
            }

            tr.appendChild(td);
            //---

            // Язык ---
            td = document.createElement("td");

            if (word) {
                let lang = word.getLang();
                if (lang) {
                    let spanElementLang = new SpanElementLang(null);
                    spanElementLang.setLangResponseDTO(lang);
                    await spanElementLang.prepare();
                    await spanElementLang.fill();

                    td.appendChild(spanElementLang.getSpan());
                }
            }

            tr.appendChild(td);
            //---

            // Действия ---
            td = document.createElement("td");

            let div = document.createElement("div");
            div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let button = this.#createButtonWithImgElementWordInCollectionAction(wordInCollectionResponseDTOObj);
            if (button) {
                div.appendChild(button);
            }

            td.appendChild(div);
            tr.appendChild(td);
            //---
        }

        return tr;
    }

    #createButtonWithImgElementWordInCollectionAction(wordInCollectionResponseDTOObj) {
        let buttonWithImgElement = new ButtonWithImgElement(null, null);
        buttonWithImgElement.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_16);
        buttonWithImgElement.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DEFAULT);
        buttonWithImgElement.changeDisabledStatus(true);

        if (wordInCollectionResponseDTOObj) {
            let excludedWordInCollectionIds = this.#excludedWordInCollectionIds;
            if (excludedWordInCollectionIds) {
                let wordInCollectionId = wordInCollectionResponseDTOObj.getId();
                let isExists = excludedWordInCollectionIds.has(wordInCollectionId);

                let doNeedToDeleteAllWords = this.#doNeedToDeleteAllWords;
                if (doNeedToDeleteAllWords) {
                    if (isExists) {
                        this.#changeToSelectWordInCollectionAction(buttonWithImgElement, wordInCollectionId);
                    } else {
                        this.#changeToDeselectWordInCollectionAction(buttonWithImgElement, wordInCollectionId);
                    }
                } else {
                    if (isExists) {
                        this.#changeToDeselectWordInCollectionAction(buttonWithImgElement, wordInCollectionId);
                    } else {
                        this.#changeToSelectWordInCollectionAction(buttonWithImgElement, wordInCollectionId);
                    }
                }
            }
        }

        return buttonWithImgElement.getButton();
    }

    #changeToSelectWordInCollectionAction(buttonWithImgElementObj, wordInCollectionId) {
        if (buttonWithImgElementObj && wordInCollectionId) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.DELETE);
            buttonWithImgElementObj.changeTitle("Удалить слово");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = function() {
                    buttonWithImgElementObj.changeDisabledStatus(true);

                    let excludedWordInCollectionIds = self.#excludedWordInCollectionIds;
                    if (excludedWordInCollectionIds) {
                        let doNeedToDeleteAllWords = self.#doNeedToDeleteAllWords;
                        if (doNeedToDeleteAllWords) {
                            excludedWordInCollectionIds.delete(wordInCollectionId);
                        } else {
                            excludedWordInCollectionIds.add(wordInCollectionId);
                        }
                    }

                    self.#changeToDeselectWordInCollectionAction(buttonWithImgElementObj, wordInCollectionId);
                }
            }

            buttonWithImgElementObj.changeDisabledStatus(false);
        }
    }

    #changeToDeselectWordInCollectionAction(buttonWithImgElementObj, wordInCollectionId) {
        if (buttonWithImgElementObj && wordInCollectionId) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.WAIT);
            buttonWithImgElementObj.changeTitle("Слово выделено для удаления. Чтобы снять выделение, нажмите кнопку");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = function() {
                    buttonWithImgElementObj.changeDisabledStatus(true);

                    let excludedWordInCollectionIds = self.#excludedWordInCollectionIds;
                    if (excludedWordInCollectionIds) {
                        let doNeedToDeleteAllWords = self.#doNeedToDeleteAllWords;
                        if (doNeedToDeleteAllWords) {
                            excludedWordInCollectionIds.add(wordInCollectionId);
                        } else {
                            excludedWordInCollectionIds.delete(wordInCollectionId);
                        }
                    }

                    self.#changeToSelectWordInCollectionAction(buttonWithImgElementObj, wordInCollectionId);
                }
            }

            buttonWithImgElementObj.changeDisabledStatus(false);
        }
    }


    async prepare() {
        await super.prepare();

        let buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete =
            this.#buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete;
        if (buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete) {
            if (!buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.getIsPrepared()) {
                buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.prepare();
            }

            let self = this;
            buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.setAfterDoubleClickFunction(function() {
                self.#doNeedToDeleteAllWords = true;

                let excludedWordInCollectionIds = self.#excludedWordInCollectionIds;
                if (excludedWordInCollectionIds) {
                    excludedWordInCollectionIds.clear();
                }

                buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.refresh();
                self.startToFill();
            });
        }

        let buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete =
            this.#buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete;
        if (buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete) {
            if (!buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.getIsPrepared()) {
                buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.prepare();
            }

            let self = this;
            buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.setAfterDoubleClickFunction(function () {
                self.#doNeedToDeleteAllWords = false;

                let excludedWordInCollectionIds = self.#excludedWordInCollectionIds;
                if (excludedWordInCollectionIds) {
                    excludedWordInCollectionIds.clear();
                }

                buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.refresh();
                self.startToFill();
            });
        }

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function() {
                self.startToFill();
            });
        }

        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let self = this;
            buttonElementRefresh.setBeforeRefreshFunction(function () {
                self.changeDisabledStatusToTableInstruments(true);

                // Отображаем загрузки на момент перезагрузки ---
                self.showLoading();
                //---
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let customerCollectionId = this.#customerCollectionId;
        if (customerCollectionId) {
            // Получаем данные для поиска ---
            let title;
            let inputTextElementFinder = this.#inputTextElementFinder;
            if (inputTextElementFinder) {
                title = inputTextElementFinder.getValue();
            }

            let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;
            let lastWordInCollectionIdOnPreviousPage = this.getValueForNextPage();
            //---

            let jsonResponse = await _WORDS_IN_COLLECTION_API.GET.getAll(
                customerCollectionId, maxNumberOfWordsOnPage, title, lastWordInCollectionIdOnPreviousPage);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                trsArr = [];

                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    let wordInCollectionResponseDTO = new WordInCollectionResponseDTO(json[i]);

                    let tr = await this.#createTr(wordInCollectionResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }

                    if (i === json.length - 1) {
                        this.setValueForNextPage(wordInCollectionResponseDTO.getId());
                    }
                }

                // Генерируем строку "Показать больше" ---
                if (this.getFindStatus() && json.length === maxNumberOfWordsOnPage) {
                    let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfWordsOnPage} слов в коллекции`);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
                //---
            } else {
                this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                    _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
            }
        } else {
            this.showMessage("Id коллекции не установлен");
        }

        return trsArr;
    }

    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete =
            this.#buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete;
        if (buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete) {
            buttonWithImgAndSpanElementDoubleClickSelectAllWordsForDelete.changeDisabledStatus(isDisabled);
        }

        let buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete =
            this.#buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete;
        if (buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete) {
            buttonWithImgAndSpanElementDoubleClickDeselectAllWordsForDelete.changeDisabledStatus(isDisabled);
        }

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            inputTextElementFinder.changeDisabledStatus(isDisabled);
        }
    }
}