import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    CssTableElement
} from "../../../../css/table/css_table_element.js";

import {
    WordsInCollectionAPI
} from "../../../../api/entity/words_in_collection_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    WordInCollectionAddRequestDTO
} from "../../../../dto/entity/word_in_collection/request/word_in_collection_add_request_dto.js";

import {
    ButtonElementWordInCollectionAction
} from "../../../button/entity/word_in_collection/button_element_word_in_collection_action.js";

import {
    WordInCollectionResponseDTO
} from "../../../../dto/entity/word_in_collection/response/word_in_collection_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    EventNames
} from "../../../event_names.js";

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_TABLE_ELEMENT = new CssTableElement();

const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWordsInCollection extends TableWithTimerAbstractElement {
    // Контейнер "Статистика коллекций" ---
    #divWithTimerElementCustomerCollectionsStatistic;
    //---

    // Элементы для поиска в таблице ---
    #inputTextElementFinder;
    #selectElementCustomerCollections;
    #buttonElementRefresh;

    #customerCollectionId = 0n;
    #doNeedActions = false;
    //---

    // Контейнер "Информация о коллекции" ---
    #divWithTimerElementCustomerCollectionInfo;
    //---

    #maxNumberOfWordsOnPage = 20;

    constructor(table, colgroup, thead, tbody, doNeedActions) {
        super(table, colgroup, thead, tbody);

        this.#doNeedActions = doNeedActions;
    }


    setDivWithTimerElementCustomerCollectionsStatistic(divWithTimerElementCustomerCollectionsStatisticObj) {
        this.#divWithTimerElementCustomerCollectionsStatistic = divWithTimerElementCustomerCollectionsStatisticObj;
    }

    setInputTextElementFinder(textElementFinderObj) {
        this.#inputTextElementFinder = textElementFinderObj;
    }

    setSelectElementCustomerCollections(selectElementCustomerCollectionsObj) {
        this.#selectElementCustomerCollections = selectElementCustomerCollectionsObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }

    setDivWithTimerElementCustomerCollectionInfo(divWithTimerElementCustomerCollectionInfo) {
        this.#divWithTimerElementCustomerCollectionInfo = divWithTimerElementCustomerCollectionInfo;
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }


    #startToFillAll() {
        this.startToFill();

        let divWithTimerElementCustomerCollectionsStatistic = this.#divWithTimerElementCustomerCollectionsStatistic;
        if (divWithTimerElementCustomerCollectionsStatistic) {
            divWithTimerElementCustomerCollectionsStatistic.startToFill();
        }

        let divWithTimerElementCustomerCollectionInfo = this.#divWithTimerElementCustomerCollectionInfo;
        if (divWithTimerElementCustomerCollectionInfo) {
            divWithTimerElementCustomerCollectionInfo.startToFill();
        }
    }

    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let customerCollectionId = this.#customerCollectionId;
        if (!customerCollectionId) {
            let selectElementCustomerCollections =
                this.#selectElementCustomerCollections;
            if (selectElementCustomerCollections) {
                customerCollectionId = selectElementCustomerCollections.getSelectedValue();
            }
        }

        if (!customerCollectionId) {
            isCorrect = false;
            this.showMessage("Выберите коллекцию, чтобы увидеть слова в ней.", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
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
            let doNeedActions = this.#doNeedActions;
            if (doNeedActions) {
                td = document.createElement("td");

                let divActions = document.createElement("div");
                divActions.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let wordInCollectionRequestDTO = new WordInCollectionAddRequestDTO();
                wordInCollectionRequestDTO.setId(wordInCollectionResponseDTOObj.getId());

                let word = wordInCollectionResponseDTOObj.getWord();
                if (word) {
                    wordInCollectionRequestDTO.setWordId(word.getId());
                }

                let customerCollection = wordInCollectionResponseDTOObj.getCustomerCollection();
                if (customerCollection) {
                    wordInCollectionRequestDTO.setCustomerCollectionId(customerCollection.getId());
                }

                let button = await this.#createButtonWordInCollectionAction(wordInCollectionRequestDTO);
                if (button) {
                    divActions.appendChild(button);
                }

                td.appendChild(divActions);
                tr.appendChild(td);
            }
            //---
        }

        return tr;
    }

    async #createButtonWordInCollectionAction(wordInCollectionAddRequestDTOObj) {
        let button;
        if (wordInCollectionAddRequestDTOObj) {
            let buttonElementWordInCollectionAction =
                new ButtonElementWordInCollectionAction(null, null);
            buttonElementWordInCollectionAction.setWordInCollectionAddRequestDTO(wordInCollectionAddRequestDTOObj);
            buttonElementWordInCollectionAction.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_16);

            await buttonElementWordInCollectionAction.changeToDelete();

            button = buttonElementWordInCollectionAction.getButton();
            if (button) {
                let self = this;
                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function () {
                    let divWithTimerElementCustomerCollectionInfo =
                        self.#divWithTimerElementCustomerCollectionInfo;
                    if (divWithTimerElementCustomerCollectionInfo) {
                        divWithTimerElementCustomerCollectionInfo.startToFill();
                    }
                });
            }
        }

        return button;
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "5%";
        colgroup.appendChild(col);

        col = col.cloneNode(false);
        col.style.width = "65%";
        colgroup.appendChild(col);

        col = col.cloneNode(false);
        col.style.width = "30%";
        colgroup.appendChild(col);

        let doNeedActions = this.#doNeedActions;
        if (doNeedActions) {
            col = col.cloneNode(false);
            col.style.width = "50px";
            colgroup.appendChild(col);
        }

        table.appendChild(colgroup);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_MEDIUM_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "№";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Слово";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Язык";
        tr.appendChild(th);

        if (doNeedActions) {
            th = th.cloneNode(false);
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setColgroup(colgroup);
        this.setThead(thead);
        this.setTbody(tbody);
    }


    async prepare() {
        await super.prepare();

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function() {
                self.#startToFillAll();
            });
        }

        let selectElementCustomerCollections = this.#selectElementCustomerCollections;
        if (selectElementCustomerCollections) {
            if (!selectElementCustomerCollections.getIsPrepared()) {
                selectElementCustomerCollections.prepare();
                await selectElementCustomerCollections.fill();
            }

            let select = selectElementCustomerCollections.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.#startToFillAll();
                })
            }
        }

        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            if (!buttonElementRefresh.getIsPrepared()) {
                buttonElementRefresh.prepare();
            }

            let self = this;
            buttonElementRefresh.setBeforeRefreshFunction(function() {
                self.changeDisabledStatusToTableInstruments(true);

                // Отображаем загрузки на момент перезагрузки ---
                self.showLoading();

                let divWithTimerElementCustomerCollectionsStatistic = self.#divWithTimerElementCustomerCollectionsStatistic;
                if (divWithTimerElementCustomerCollectionsStatistic) {
                    divWithTimerElementCustomerCollectionsStatistic.showLoading();
                }

                let divWithTimerElementCustomerCollectionInfo = self.#divWithTimerElementCustomerCollectionInfo;
                if (divWithTimerElementCustomerCollectionInfo) {
                    divWithTimerElementCustomerCollectionInfo.showLoading();
                }
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementCustomerCollections = self.#selectElementCustomerCollections;
                if (selectElementCustomerCollections) {
                    await selectElementCustomerCollections.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.#startToFillAll();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }


    async tryToCreateTrsArr(giveAccessToCreateTrMessage) {
        let trsArr;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            // Получаем данные для поиска ---
            let customerCollectionId = this.#customerCollectionId;
            if (!customerCollectionId) {
                let selectElementCustomerCollections = this.#selectElementCustomerCollections;
                if (selectElementCustomerCollections) {
                    customerCollectionId = selectElementCustomerCollections.getSelectedValue();
                }
            }

            let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;

            let title;
            let inputTextElementFinder = this.#inputTextElementFinder;
            if (inputTextElementFinder) {
                title = inputTextElementFinder.getValue();
            }

            let lastWordInCollectionIdOnPreviousPage = this.getValueForNextPage();
            //---

            let jsonResponse = await _WORDS_IN_COLLECTION_API.GET.getAll(
                customerCollectionId, maxNumberOfWordsOnPage, title, lastWordInCollectionIdOnPreviousPage);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                trsArr = [];

                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    if (!this.getFindStatus()) break;

                    let wordInCollectionResponseDTO = new WordInCollectionResponseDTO(json[i]);
                    let tr = await this.#createTr(wordInCollectionResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }

                    if (i === json.length - 1) {
                        this.setValueForNextPage(wordInCollectionResponseDTO.getId());
                    }
                }

                let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;
                if (this.getFindStatus() && json.length === maxNumberOfWordsOnPage) {
                    let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfWordsOnPage} слов в коллекции...`);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
            } else if (giveAccessToCreateTrMessage) {
                let message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                this.showMessage(message, _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
            }
        }

        return trsArr;
    }


    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            inputTextElementFinder.changeDisabledStatus(isDisabled);
        }

        let selectElementCustomerCollections = this.#selectElementCustomerCollections;
        if (selectElementCustomerCollections) {
            selectElementCustomerCollections.changeDisabledStatus(isDisabled);
        }
    }
}