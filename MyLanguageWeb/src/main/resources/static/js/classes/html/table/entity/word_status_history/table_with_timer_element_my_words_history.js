import {
    WordStatusHistoriesAPI
} from "../../../../api/entity/word_status_histories_api.js";

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
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "../../../button/with_img/button_with_img_element_types.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    TableWithTimerAbstractElement
} from "../../with_timer/abstracts/table_with_timer_abstract_element.js";

import {
    ButtonWithImgElement
} from "../../../button/with_img/button_with_img_element.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    SpanElementWordStatus
} from "../../../span/entity/word_status/span_element_word_status.js";

import {
    WordStatusHistoryResponseDTO
} from "../../../../dto/entity/word_status_history/response/word_status_history_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    DateParts
} from "../../../date_parts.js";

const _WORD_STATUS_HISTORIES = new WordStatusHistoriesAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_TABLE_ELEMENT = new CssTableElement();

const _PROJECT_COOKIES = new ProjectCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _TABLE_UTILS = new TableUtils();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementMyWordsHistory extends TableWithTimerAbstractElement {
    #divWithTimerElementWordsStatistic;

    #inputTextElementFinder;
    #selectElementLangsIn;
    #selectElementWordStatuses;
    #buttonElementRefresh;

    #maxNumberOfWordsOnPage = 20;
    #myWordHistoryRowsMap = new Map();

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setDivWithTimerElementWordsStatistic(divWithTimerElementWordsStatisticObj) {
        this.#divWithTimerElementWordsStatistic = divWithTimerElementWordsStatisticObj;
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setSelectElementLangsIn(selectElementLangsInObj) {
        this.#selectElementLangsIn = selectElementLangsInObj;
    }

    setSelectElementWordStatuses(selectElementWordStatusesObj) {
        this.#selectElementWordStatuses = selectElementWordStatusesObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    #startToFillAll() {
        this.startToFill();

        let divWithTimerElementWordsStatistic = this.#divWithTimerElementWordsStatistic;
        if (divWithTimerElementWordsStatistic) {
            divWithTimerElementWordsStatistic.startToFill();
        }
    }

    async #createTr(wordStatusHistoryResponseDTOObj) {
        let tr;
        if (wordStatusHistoryResponseDTOObj) {
            let tableWordStatusHistory =
                await this.#createTableByWordStatusHistory(wordStatusHistoryResponseDTOObj);

            let divContainer;
            if (tableWordStatusHistory) {
                divContainer = document.createElement("div");
                divContainer.appendChild(tableWordStatusHistory);

                let myWordHistoryRow = new MyWordHistoryRow();
                myWordHistoryRow.setDivContainer(divContainer);

                let myWordHistoryRowsMap = this.#myWordHistoryRowsMap;
                if (myWordHistoryRowsMap) {
                    myWordHistoryRowsMap.set(wordStatusHistoryResponseDTOObj.getId(), myWordHistoryRow);
                }
            }

            // Создаём строку на основе сгенерированного контейнера ---
            if (divContainer) {
                tr = _TABLE_UTILS.createTrWithAnyElement(divContainer, this.getNumberOfColumns(), true);
            }
            //---
        }

        return tr;
    }

    async #createTableByWordStatusHistory(wordStatusHistoryResponseDTOObj) {
        let table;

        let tr = await this.#createTrWordWithCurrentWordStatus(wordStatusHistoryResponseDTOObj)
        if (tr) {
            table = document.createElement("table");
            table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);

            let currentRowNumber = this.getCurrentRowNumber();
            if (currentRowNumber % 2n === 0n) {
                table.style.margin = "-10px -5px -5px -5px";
            }

            let selfColgroup = this.getColgroup();
            if (selfColgroup) {
                let colgroup = selfColgroup.cloneNode(true);
                table.appendChild(colgroup);
            }

            let tbody = document.createElement("tbody");
            if (currentRowNumber % 2n === 0n) {
                let invisibleRow = document.createElement("tr");
                tbody.appendChild(invisibleRow);
            }
            tbody.appendChild(tr);

            table.appendChild(tbody);
            //---
        }

        return table;
    }

    async #createTrWordWithCurrentWordStatus(wordStatusHistoryResponseDTOObj) {
        let tr;
        if (wordStatusHistoryResponseDTOObj) {
            tr = document.createElement("tr");

            // Номер строки ---
            let td = document.createElement("td");

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            td.style.textAlign = "center";

            tr.appendChild(td);
            //---

            // Название слова ---
            td = document.createElement("td");

            let word = wordStatusHistoryResponseDTOObj.getWord();
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

            // Статус ---
            td = document.createElement("td");

            let wordStatus = wordStatusHistoryResponseDTOObj.getWordStatus();
            if (wordStatus) {
                let spanElementWordStatus = new SpanElementWordStatus(null);
                spanElementWordStatus.setWordStatusResponseDTO(wordStatus);
                await spanElementWordStatus.prepare();
                await spanElementWordStatus.fill();

                td.appendChild(spanElementWordStatus.getSpan());
            }

            tr.appendChild(td);
            //---

            // Дата изменения статуса ---
            td = document.createElement("td");

            let dateOfStart = wordStatusHistoryResponseDTOObj.getDateOfStart();
            if (dateOfStart) {
                td.textContent = new DateParts(dateOfStart).getDateWithTimeStr();
            }

            tr.appendChild(td);
            //---

            // Действия ---
            td = document.createElement("td");

            let divActions = document.createElement("div");
            divActions.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            if (word) {
                let buttonWithImgElement = new ButtonWithImgElement();
                buttonWithImgElement.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_16);

                this.#changeToShowHistoryAction(buttonWithImgElement, wordStatusHistoryResponseDTOObj);

                let button = buttonWithImgElement.getButton();
                if (button) {
                    divActions.appendChild(button);
                }
            }

            td.appendChild(divActions);

            tr.appendChild(td);
            //---
        }

        return tr;
    }

    #changeToShowHistoryAction(buttonWithImgElementObj, wordStatusHistoryResponseDTOObj) {
        if (buttonWithImgElementObj && wordStatusHistoryResponseDTOObj) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_DOWN);
            buttonWithImgElementObj.changeTitle("Показать историю изменения статуса слова");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = async function() {
                    buttonWithImgElementObj.changeDisabledStatus(true);

                    let myWordHistoryRowsMap = self.#myWordHistoryRowsMap;
                    if (myWordHistoryRowsMap) {
                        let myWordHistoryRow = myWordHistoryRowsMap.get(wordStatusHistoryResponseDTOObj.getId());
                        if (myWordHistoryRow) {
                            // Создаём таблицу ---
                            let colgroup;
                            let selfColgroup = self.getColgroup();
                            if (selfColgroup) {
                                colgroup = selfColgroup.cloneNode(true);
                            }

                            let tableWithTimerElementWordStatusChangesHistory =
                                new TableWithTimerElementWordStatusChangesHistory(null, colgroup, null, null);
                            tableWithTimerElementWordStatusChangesHistory.setTimeout(self.getTimeout());
                            await tableWithTimerElementWordStatusChangesHistory.prepare();

                            let word = wordStatusHistoryResponseDTOObj.getWord();
                            if (word) {
                                tableWithTimerElementWordStatusChangesHistory.setWordId(word.getId());
                            }
                            //---

                            // Сохраняем экземпляр в строке ---
                            myWordHistoryRow.setTableWithTimerElementWordStatusChangesHistory(
                                tableWithTimerElementWordStatusChangesHistory);
                            //---

                            myWordHistoryRow.showHistory();
                            self.#changeToHideHistoryAction(buttonWithImgElementObj, wordStatusHistoryResponseDTOObj);
                        }
                    }
                }

                buttonWithImgElementObj.changeDisabledStatus(false);
            }
        }
    }

    #changeToHideHistoryAction(buttonWithImgElementObj, wordStatusHistoryResponseDTOObj) {
        if (buttonWithImgElementObj && wordStatusHistoryResponseDTOObj) {
            buttonWithImgElementObj.changeDisabledStatus(true);
            buttonWithImgElementObj.changeTo(_BUTTON_WITH_IMG_ELEMENT_TYPES.ARROW_UP);
            buttonWithImgElementObj.changeTitle("Скрыть историю изменения статуса слова");

            let button = buttonWithImgElementObj.getButton();
            if (button) {
                let self = this;
                button.onclick = function () {
                    buttonWithImgElementObj.changeDisabledStatus(false);

                    let myWordHistoryRowsMap = self.#myWordHistoryRowsMap;
                    if (myWordHistoryRowsMap) {
                        let myWordHistoryRow = myWordHistoryRowsMap.get(wordStatusHistoryResponseDTOObj.getId());
                        if (myWordHistoryRow) {
                            myWordHistoryRow.hideHistory();
                            self.#changeToShowHistoryAction(buttonWithImgElementObj, wordStatusHistoryResponseDTOObj);
                        }
                    }
                }

                buttonWithImgElementObj.changeDisabledStatus(false);
            }
        }
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

        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            if (!selectElementLangsIn.getIsPrepared()) {
                selectElementLangsIn.prepare();
                await selectElementLangsIn.fill();
            }

            let select = selectElementLangsIn.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.#startToFillAll();
                })
            }
        }

        let selectElementWordStatuses = this.#selectElementWordStatuses;
        if (selectElementWordStatuses) {
            if (!selectElementWordStatuses.getIsPrepared()) {
                selectElementWordStatuses.prepare();
                await selectElementWordStatuses.fill();
            }

            let select = selectElementWordStatuses.getSelect();
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

                let divWithTimerElementWordsStatistic = self.#divWithTimerElementWordsStatistic;
                if (divWithTimerElementWordsStatistic) {
                    divWithTimerElementWordsStatistic.showLoading();
                }
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementLangsIn = self.#selectElementLangsIn;
                if (selectElementLangsIn) {
                    await selectElementLangsIn.refresh(true);
                }

                let selectElementWordStatuses = self.#selectElementWordStatuses;
                if (selectElementWordStatuses) {
                    await selectElementWordStatuses.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.#startToFillAll();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }


    startToFill() {
        super.startToFill();

        let divWithTimerElementWordsStatistic = this.#divWithTimerElementWordsStatistic;
        if (divWithTimerElementWordsStatistic) {
            divWithTimerElementWordsStatistic.startToFill();
        }
    }

    stopToFill() {
        super.stopToFill();

        // Останавливаем все таймеры в строках, очищаем мапу ---
        let myWordHistoryRowsMap = this.#myWordHistoryRowsMap;
        if (myWordHistoryRowsMap) {
            for (let key of myWordHistoryRowsMap.keys()) {
                let myWordHistoryRow = myWordHistoryRowsMap.get(key);
                if (myWordHistoryRow) {
                    let tableWithTimerElementWordStatusHistoryForCurrentWord =
                        myWordHistoryRow.getTableWithTimerElementWordStatusChangesHistory();
                    if (tableWithTimerElementWordStatusHistoryForCurrentWord) {
                        tableWithTimerElementWordStatusHistoryForCurrentWord.stopToFill();
                    }
                }
            }

            myWordHistoryRowsMap.clear();
        }
        //---
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем значения для поиска ---
        let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;
        let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();

        let title;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            title = inputTextElementFinder.getValue();
        }

        let langCode;
        let selectElementLangs = this.#selectElementLangsIn;
        if (selectElementLangs) {
            langCode = selectElementLangs.getSelectedValue();
        }

        let wordStatusCode;
        let selectElementWordStatuses = this.#selectElementWordStatuses;
        if (selectElementWordStatuses) {
            wordStatusCode = selectElementWordStatuses.getSelectedValue();
        }

        let lastWordStatusHistoryIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _WORD_STATUS_HISTORIES.GET.getAllWordsWithCurrentStatus(title, langCode, wordStatusCode,
            customerId, maxNumberOfWordsOnPage, lastWordStatusHistoryIdOnPreviousPage);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let wordStatusHistoryResponseDTO = new WordStatusHistoryResponseDTO(json[i]);
                let tr = await this.#createTr(wordStatusHistoryResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }

                if (i === json.length - 1) {
                    this.setValueForNextPage(wordStatusHistoryResponseDTO.getId());
                }
            }

            let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;
            if (this.getFindStatus() && json.length === maxNumberOfWordsOnPage) {
                let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfWordsOnPage} слов...`);
                if (tr) {
                    trsArr.push(tr);
                }
            }
        } else if (giveAccessToShowMessage) {
            let message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
            this.showMessage(message, _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
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

        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            selectElementLangsIn.changeDisabledStatus(isDisabled);
        }

        let selectElementWordStatuses = this.#selectElementWordStatuses;
        if (selectElementWordStatuses) {
            selectElementWordStatuses.changeDisabledStatus(isDisabled);
        }
    }
}

class MyWordHistoryRow {
    #divContainer;
    #tableWithTimerElementWordStatusChangesHistory;

    #divWithTableBetweenTwoHorizontalDelimiters;

    getDivContainer() {
        return this.#divContainer;
    }

    setDivContainer(divContainer) {
        this.#divContainer = divContainer;
    }

    getTableWithTimerElementWordStatusChangesHistory() {
        return this.#tableWithTimerElementWordStatusChangesHistory;
    }

    setTableWithTimerElementWordStatusChangesHistory(tableWithTimerElementWordStatusChangesHistoryObj) {
        this.#tableWithTimerElementWordStatusChangesHistory = tableWithTimerElementWordStatusChangesHistoryObj;
    }

    showHistory() {
        let divContainer = this.#divContainer;
        let tableWithTimerElementWordStatusChangesHistory = this.#tableWithTimerElementWordStatusChangesHistory;
        if (divContainer && tableWithTimerElementWordStatusChangesHistory) {
            let table = tableWithTimerElementWordStatusChangesHistory.getTable();
            if (table) {
                let divWithTableBetweenTwoHorizontalDelimiters =
                    _TABLE_UTILS.createDivWithTableBetweenTwoHorizontalDelimiters(table);
                if (divWithTableBetweenTwoHorizontalDelimiters) {
                    divContainer.appendChild(divWithTableBetweenTwoHorizontalDelimiters);

                    this.#divWithTableBetweenTwoHorizontalDelimiters = divWithTableBetweenTwoHorizontalDelimiters;
                }
            }

            tableWithTimerElementWordStatusChangesHistory.startToFill();
        }
    }

    hideHistory() {
        let divContainer = this.#divContainer;
        let tableWithTimerElementWordStatusChangesHistory = this.#tableWithTimerElementWordStatusChangesHistory;
        let divWithTableBetweenTwoHorizontalDelimiters = this.#divWithTableBetweenTwoHorizontalDelimiters;
        if (divContainer
            && tableWithTimerElementWordStatusChangesHistory
            && divWithTableBetweenTwoHorizontalDelimiters) {
            tableWithTimerElementWordStatusChangesHistory.stopToFill();
            divContainer.removeChild(divWithTableBetweenTwoHorizontalDelimiters);
        }
    }
}

class TableWithTimerElementWordStatusChangesHistory extends TableWithTimerAbstractElement {
    #wordId;

    setWordId(wordId) {
        this.#wordId = wordId;
    }


    async #createTr(wordStatusHistoryResponseDTOObj) {
        let tr;
        if (wordStatusHistoryResponseDTOObj) {
            tr = document.createElement("tr");

            // Пустая колонка  ---
            let td = document.createElement("td");
            tr.appendChild(td);
            //---

            // Название слова ---
            td = document.createElement("td");

            let word = wordStatusHistoryResponseDTOObj.getWord();
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

            // Статус ---
            td = document.createElement("td");

            let wordStatus = wordStatusHistoryResponseDTOObj.getWordStatus();
            if (wordStatus) {
                let spanElementWordStatus = new SpanElementWordStatus(null);
                spanElementWordStatus.setWordStatusResponseDTO(wordStatus);
                await spanElementWordStatus.prepare();
                await spanElementWordStatus.fill();

                td.appendChild(spanElementWordStatus.getSpan());
            }

            tr.appendChild(td);
            //---

            // Дата изменения статуса ---
            td = document.createElement("td");

            let dateOfStart = wordStatusHistoryResponseDTOObj.getDateOfStart();
            if (dateOfStart) {
                td.textContent = new DateParts(dateOfStart).getDateWithTimeStr();
            }

            tr.appendChild(td);
            //---

            // Пустая колонка  ---
            td = document.createElement("td");
            tr.appendChild(td);
        }

        return tr;
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем значения для поиска ---
        let wordId = this.#wordId;
        //---

        let jsonResponse = await _WORD_STATUS_HISTORIES.GET.getAllWordChangesHistory(wordId);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let wordStatusHistoryResponseDTO = new WordStatusHistoryResponseDTO(json[i]);
                let tr = await this.#createTr(wordStatusHistoryResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }
            }
        } else if (giveAccessToShowMessage) {
            let message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
            this.showMessage(message, _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return trsArr;
    }
}