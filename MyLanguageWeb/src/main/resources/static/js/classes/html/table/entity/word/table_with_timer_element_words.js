import {
    WordsAPI
} from "../../../../api/entity/words_api.js";

import {
    WordsInCollectionAPI
} from "../../../../api/entity/words_in_collection_api.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    WordStatuses
} from "../../../../dto/entity/word_status/word_statuses.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ButtonWithImgElementSizes
} from "../../../button/with_img/button_with_img_element_sizes.js";

import {
    TableWithTimerAbstractElement
} from "../../with_timer/abstracts/table_with_timer_abstract_element.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    WordInCollectionAddRequestDTO
} from "../../../../dto/entity/word_in_collection/request/word_in_collection_add_request_dto.js";

import {
    WordInCollectionResponseDTO
} from "../../../../dto/entity/word_in_collection/response/word_in_collection_response_dto.js";

import {
    ButtonElementWordInCollectionAction
} from "../../../button/entity/word_in_collection/button_element_word_in_collection_action.js";

import {
    CustomerCollectionResponseDTO
} from "../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

import {
    WordResponseDTO
} from "../../../../dto/entity/word/response/word_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

import {
    EventNames
} from "../../../event_names.js";

const _WORDS_API = new WordsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _WORD_STATUSES = new WordStatuses();
const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWords extends TableWithTimerAbstractElement {
    #divWithTimerElementWordsStatistic;

    #inputTextElementFinder;
    #selectElementLangsIn;
    #selectElementCustomerCollections;
    #buttonElementRefresh;

    #divWithTimerElementCustomerCollectionInfo;

    #maxNumberOfWordsOnPage = 20;

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

    setSelectElementCustomerCollections(selectElementCustomerCollectionsObj) {
        this.#selectElementCustomerCollections = selectElementCustomerCollectionsObj;
    }

    setButtonElementRefresh(buttonElementRefresh) {
        this.#buttonElementRefresh = buttonElementRefresh;
    }

    setDivWithTimerElementCustomerCollectionInfo(divWithTimerElementCustomerCollectionInfoObj) {
        this.#divWithTimerElementCustomerCollectionInfo = divWithTimerElementCustomerCollectionInfoObj;
    }


    #startToFillAll() {
        this.startToFill();

        // Контейнер "Статистика по словам" ---
        let divWithTimerElementWordsStatistic = this.#divWithTimerElementWordsStatistic;
        if (divWithTimerElementWordsStatistic) {
            divWithTimerElementWordsStatistic.startToFill();
        }
        //---

        // Контейнер "Информация о коллекции" ---
        let divWithTimerElementCustomerCollectionInfo = this.#divWithTimerElementCustomerCollectionInfo;
        if (divWithTimerElementCustomerCollectionInfo) {
            divWithTimerElementCustomerCollectionInfo.startToFill();
        }
        //---
    }

    async #createTr(wordResponseDTOObj) {
        let tr;
        if (wordResponseDTOObj) {
            tr = document.createElement("tr");

            // Порядковый номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber()
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Текст слова ---
            td = document.createElement("td");
            td.textContent = wordResponseDTOObj.getTitle();

            tr.appendChild(td);
            //---

            // Язык ---
            td = document.createElement("td");

            let lang = wordResponseDTOObj.getLang();
            if (lang) {
                let spanElementLang = new SpanElementLang(null);
                spanElementLang.setLangResponseDTO(lang);
                await spanElementLang.prepare();
                await spanElementLang.fill();

                td.appendChild(spanElementLang.getSpan());
            }

            tr.appendChild(td);
            //---

            // Кнопка добавления/удаления слова (только для авторизированных пользователей) ---
            let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
            if (customerId) {
                td = document.createElement("td");

                let divActions = document.createElement("div");
                divActions.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

                let wordInCollectionAddRequestDTO = new WordInCollectionAddRequestDTO();
                wordInCollectionAddRequestDTO.setWordId(wordResponseDTOObj.getId());

                let selectElementCustomerCollections = this.#selectElementCustomerCollections;
                if (selectElementCustomerCollections) {
                    wordInCollectionAddRequestDTO.setCustomerCollectionId(
                        selectElementCustomerCollections.getSelectedValue());
                }

                let button = await this.#createButtonWordInCollectionAction(wordInCollectionAddRequestDTO);
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

    async #createButtonWordInCollectionAction(wordInCollectionRequestDTOObj) {
        let button;
        if (wordInCollectionRequestDTOObj) {
            // Проводим предварительные проверки ---
            let isCorrect = true;
            let title;

            let customerCollectionId = wordInCollectionRequestDTOObj.getCustomerCollectionId();
            if (!customerCollectionId) {
                isCorrect = false;
                title = "Выберите коллекцию, чтобы взаимодействовать с ней";
            }
            //---

            // Проверяем, нет ли слова в коллекции ---
            if (isCorrect) {
                let wordId = wordInCollectionRequestDTOObj.getWordId();
                let jsonResponse = await _WORDS_IN_COLLECTION_API.GET.findWordInCollection(wordId, customerCollectionId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let wordInCollection = new WordInCollectionResponseDTO(jsonResponse.getJson());
                    wordInCollectionRequestDTOObj.setId(wordInCollection.getId());
                }
            }
            //---

            // Генерируем кнопку ---
            let buttonElementWordInCollectionAction =
                new ButtonElementWordInCollectionAction(null, null);
            buttonElementWordInCollectionAction.setWordInCollectionAddRequestDTO(wordInCollectionRequestDTOObj);
            buttonElementWordInCollectionAction.changeButtonWithImgElementSize(_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_16);
            if (isCorrect) {
                if (!wordInCollectionRequestDTOObj.getId()) {
                    await buttonElementWordInCollectionAction.changeToAdd();
                } else {
                    await buttonElementWordInCollectionAction.changeToDelete();
                }
            } else {
                buttonElementWordInCollectionAction.changeToDisabled(title)
            }
            //---

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


    async prepare() {
        await super.prepare();

        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            if (!inputTextElementFinder.getIsPrepared()) {
                inputTextElementFinder.prepare();
            }

            let self = this;
            inputTextElementFinder.addInputFunction(function () {
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
                });
            }
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
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    let customerCollectionId = selectElementCustomerCollections.getSelectedValue();
                    if (customerCollectionId) {
                        // При изменении элемента выпадающего списка коллекций,
                        // мы должны изменить значение выпадающего списка языков ---
                        let selectElementLangsIn = self.#selectElementLangsIn;
                        if (selectElementLangsIn) {
                            let langCode;
                            let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                let customerCollectionResponseDTO =
                                    new CustomerCollectionResponseDTO(jsonResponse.getJson());

                                let lang = customerCollectionResponseDTO.getLang();
                                if (lang) {
                                    langCode = lang.getCode();
                                }
                            }

                            selectElementLangsIn.changeSelectedOptionByValue(langCode, true);
                        }
                        //---
                    }

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
                let divWithTimerElementWordsStatistic = self.#divWithTimerElementWordsStatistic;
                if (divWithTimerElementWordsStatistic) {
                    divWithTimerElementWordsStatistic.showLoading();
                }

                let divWithTimerElementCustomerCollectionInfo = self.#divWithTimerElementCustomerCollectionInfo;
                if (divWithTimerElementCustomerCollectionInfo) {
                    divWithTimerElementCustomerCollectionInfo.showLoading();
                }

                self.showLoading();
                //---
            });
            buttonElementRefresh.setRefreshFunction(async function() {
                let selectElementLangsIn = self.#selectElementLangsIn;
                if (selectElementLangsIn) {
                    await selectElementLangsIn.refresh(true);
                }

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


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем значения для поиска ---
        let title;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            title = inputTextElementFinder.getValue();
        }

        let wordStatusCode = _WORD_STATUSES.ACTIVE.CODE;

        let langCode;
        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            langCode = selectElementLangsIn.getSelectedValue();
        }

        let maxNumberOfWordsOnPage = this.#maxNumberOfWordsOnPage;
        let lastWordIdOnPreviousPage = this.getValueForNextPage();
        //---

        let jsonResponse = await _WORDS_API.GET.getAll(
            title, langCode, wordStatusCode, maxNumberOfWordsOnPage, lastWordIdOnPreviousPage);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            trsArr = [];

            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                if (!this.getFindStatus()) break;

                let wordResponseDTO = new WordResponseDTO(json[i]);
                let tr = await this.#createTr(wordResponseDTO);
                if (tr) {
                    trsArr.push(tr);
                }

                if (i === json.length - 1) {
                    this.setValueForNextPage(wordResponseDTO.getId());
                }
            }

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

        let selectElementCustomerCollections = this.#selectElementCustomerCollections;
        if (selectElementCustomerCollections) {
            selectElementCustomerCollections.changeDisabledStatus(isDisabled);
        }
    }
}