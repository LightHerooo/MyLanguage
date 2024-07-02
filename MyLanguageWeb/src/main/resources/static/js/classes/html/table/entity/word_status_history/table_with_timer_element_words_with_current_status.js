import {
    WordStatusHistoriesAPI
} from "../../../../api/entity/word_status_histories_api.js";

import {
    WordsAPI
} from "../../../../api/entity/words_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    SelectElementWordStatuses
} from "../../../select/entity/word_status/select_element_word_statuses.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    EntityEditValueByIdRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_id_request_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    WordStatusHistoryResponseDTO
} from "../../../../dto/entity/word_status_history/response/word_status_history_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

const _WORD_STATUS_HISTORIES_API = new WordStatusHistoriesAPI();
const _WORDS_API = new WordsAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWordsWithCurrentStatus extends TableWithTimerAbstractElement {
    #inputTextFinder;
    #selectElementLangsIn;
    #selectElementWordStatuses;
    #buttonElementRefresh;

    #maxNumberOfWordStatusHistoriesOnPage = 10;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setInputTextFinder(inputTextFinderObj) {
        this.#inputTextFinder = inputTextFinderObj;
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


    async #createTr(wordStatusHistoryResponseDTOObj) {
        let tr;
        if (wordStatusHistoryResponseDTOObj) {
            const ROW_HEIGHT = "50px";

            tr = document.createElement("tr");
            tr.style.minHeight = ROW_HEIGHT;

            // Порядковый номер ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Слово ---
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

                    let span = spanElementLang.getSpan();
                    if (span) {
                        td.appendChild(span);
                    }
                }
            }

            tr.appendChild(td);
            //---

            // Статус ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementWordStatuses = new SelectElementWordStatuses(
                null, false);
            selectElementWordStatuses.prepare();
            await selectElementWordStatuses.fill();

            let wordStatus = wordStatusHistoryResponseDTOObj.getWordStatus();
            if (wordStatus) {
                selectElementWordStatuses.changeSelectedOptionByValue(wordStatus.getCode(), true);
            }

            let select = selectElementWordStatuses.getSelect();
            if (select) {
                select.style.height = ROW_HEIGHT;
                select.style.width = "100%";

                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    selectElementWordStatuses.changeDisabledStatus(true);

                    let dto = new EntityEditValueByIdRequestDTO();
                    if (word) {
                        dto.setId(word.getId())
                    }

                    dto.setValue(selectElementWordStatuses.getSelectedValue());

                    let jsonResponse = await _WORDS_API.PATCH.editWordStatus(dto);
                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                        selectElementWordStatuses.changeDisabledStatus(false);
                    } else {
                        selectElementWordStatuses.changeTitle(
                            new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                    }
                });

                td.appendChild(select);
            }

            tr.appendChild(td);
        }

        return tr;
    }


    async prepare() {
        await super.prepare();

        let inputTextFinder = this.#inputTextFinder;
        if (inputTextFinder) {
            if (!inputTextFinder.getIsPrepared()) {
                inputTextFinder.prepare();
            }

            let self = this;
            inputTextFinder.addInputFunction(function() {
                self.startToFill();
            })
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
                    self.startToFill();
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
                    self.startToFill();
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
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            });
        }
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем данные для поиска ---
        let title;
        let inputTextFinder = this.#inputTextFinder;
        if (inputTextFinder) {
            title = inputTextFinder.getValue();
        }

        let langCode;
        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            langCode = selectElementLangsIn.getSelectedValue();
        }

        let wordStatusCode;
        let selectElementWordStatuses = this.#selectElementWordStatuses;
        if (selectElementWordStatuses) {
            wordStatusCode = selectElementWordStatuses.getSelectedValue();
        }

        let maxNumberOfWordStatusHistoriesOnPage = this.#maxNumberOfWordStatusHistoriesOnPage;
        let lastWordStatusHistoryIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _WORD_STATUS_HISTORIES_API.GET.getAllWordsWithCurrentStatus(title, langCode,
            wordStatusCode, null, maxNumberOfWordStatusHistoriesOnPage, lastWordStatusHistoryIdOnPreviousPage);
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

            if (this.getFindStatus() && maxNumberOfWordStatusHistoriesOnPage === json.length) {
                let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfWordStatusHistoriesOnPage} слов с текущим статусом`);
                if (tr) {
                    trsArr.push(tr);
                }
            }
        } else if (giveAccessToShowMessage) {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return trsArr;
    }


    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let inputTextFinder = this.#inputTextFinder;
        if (inputTextFinder) {
            inputTextFinder.changeDisabledStatus(isDisabled);
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