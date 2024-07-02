import {
    LangsAPI
} from "../../../../api/entity/langs_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    CssImgSizes
} from "../../../../css/css_img_sizes.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableWithTimerAbstractElement
} from "../../with_timer/abstracts/table_with_timer_abstract_element.js";

import {
    SelectElementBoolean
} from "../../../select/elements/select_element_boolean.js";

import {
    SpanElementLang
} from "../../../span/entity/lang/span_element_lang.js";

import {
    EntityEditValueByCodeRequestDTO
} from "../../../../dto/other/request/entity/edit/entity_edit_value_by_code_request_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    YandexDictionaryLangsResponseDTO
} from "../../../../dto/entity/lang/other/yandex_dictionary_langs.js";

import {
    LangResponseDTO
} from "../../../../dto/entity/lang/response/lang_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _LANGS_API = new LangsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_IMG_SIZES = new CssImgSizes();

const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementLangs extends TableWithTimerAbstractElement {
    #inputTextElementFinder;
    #selectElementBooleanIsActiveForIn;
    #selectElementBooleanIsActiveForOut;
    #buttonElementRefresh;

    #maxNumberOfLangsOnPage = 10;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setInputTextElementFinder(inputTextElementFinderObj) {
        this.#inputTextElementFinder = inputTextElementFinderObj;
    }

    setSelectElementBooleanIsActiveForIn(selectElementBooleanIsActiveForInObj) {
        this.#selectElementBooleanIsActiveForIn = selectElementBooleanIsActiveForInObj;
    }

    setSelectElementBooleanIsActiveForOut(selectElementBooleanIsActiveForOutObj) {
        this.#selectElementBooleanIsActiveForOut = selectElementBooleanIsActiveForOutObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    async #createTr(langResponseDTOObj, yandexDictionaryLangsResponseDTOObj) {
        let tr;
        if (langResponseDTOObj && yandexDictionaryLangsResponseDTOObj) {
            const ROW_HEIGHT = "70px";

            // Проверяем поддержку на вход и выход с помощью Yandex.Dictionary ---
            let langCode = langResponseDTOObj.getCode();

            let doesSupportForIn = yandexDictionaryLangsResponseDTOObj.isExistsLangInCode(langCode);
            let doesSupportForOut = yandexDictionaryLangsResponseDTOObj.isExistsLangOutCode(langCode);
            //---

            tr = document.createElement("tr");
            tr.style.minHeight = ROW_HEIGHT;

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber()
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Язык ---
            td = document.createElement("td");

            let spanElementLang = new SpanElementLang(null);
            spanElementLang.setLangResponseDTO(langResponseDTOObj);

            await spanElementLang.prepare();
            await spanElementLang.fill();

            let span = spanElementLang.getSpan();
            if (span) {
                td.appendChild(span);
            }

            tr.appendChild(td);
            //---

            // Активен на вход ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementBooleanIsActiveForIn = new SelectElementBoolean(
                null, false);

            selectElementBooleanIsActiveForIn.prepare();
            await selectElementBooleanIsActiveForIn.fill();

            selectElementBooleanIsActiveForIn.changeSelectedOptionByValue(
                langResponseDTOObj.getIsActiveForIn(), true);

            let select = selectElementBooleanIsActiveForIn.getSelect();
            if (select) {
                select.style.height = ROW_HEIGHT;
                select.style.width = "100%";

                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    let isActiveForIn = selectElementBooleanIsActiveForIn.getSelectedValue();
                    if (doesSupportForIn || !isActiveForIn) {
                        // Переключение активности доступно только при поддержке на вход ---
                        selectElementBooleanIsActiveForIn.changeDisabledStatus(true);

                        let dto = new EntityEditValueByCodeRequestDTO();
                        dto.setCode(langResponseDTOObj.getCode());
                        dto.setValue(isActiveForIn);

                        let jsonResponse = await _LANGS_API.PATCH.editIsActiveForIn(dto);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            selectElementBooleanIsActiveForIn.changeDisabledStatus(false);
                        } else {
                            selectElementBooleanIsActiveForIn.changeTitle(
                                new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                        }
                        //---
                    } else {
                        selectElementBooleanIsActiveForIn.changeDisabledStatus(true);
                        selectElementBooleanIsActiveForIn.changeTitle(
                            `Нельзя изменить статус активности языка '${langResponseDTOObj.getTitle()}', так как он не поддерживается на вход`)
                    }
                });

                td.appendChild(select);
            }

            tr.appendChild(td);
            //---

            // Активен на выход ---
            td = document.createElement("td");
            td.style.padding = "1px";

            let selectElementBooleanIsActiveForOut = new SelectElementBoolean(
                null, false);

            selectElementBooleanIsActiveForOut.prepare();
            await selectElementBooleanIsActiveForOut.fill();

            selectElementBooleanIsActiveForOut.changeSelectedOptionByValue(
                langResponseDTOObj.getIsActiveForOut(), true);

            select = selectElementBooleanIsActiveForOut.getSelect();
            if (select) {
                select.style.height = ROW_HEIGHT;
                select.style.width = "100%";

                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    let isActiveForOut = selectElementBooleanIsActiveForOut.getSelectedValue();
                    if (doesSupportForOut || !isActiveForOut) {
                        // Переключение активности доступно только при поддержке на выход (или если мы отключаем язык) ---
                        selectElementBooleanIsActiveForOut.changeDisabledStatus(true);

                        let dto = new EntityEditValueByCodeRequestDTO();
                        dto.setCode(langResponseDTOObj.getCode());
                        dto.setValue(isActiveForOut);

                        let jsonResponse = await _LANGS_API.PATCH.editIsActiveForOut(dto);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            selectElementBooleanIsActiveForOut.changeDisabledStatus(false);
                        } else {
                            selectElementBooleanIsActiveForOut.changeTitle(
                                new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
                        }
                        //---
                    } else {
                        selectElementBooleanIsActiveForOut.changeDisabledStatus(true);
                        selectElementBooleanIsActiveForOut.changeTitle(
                            `Нельзя изменить статус активности языка '${langResponseDTOObj.getTitle()}', так как он не поддерживается на выход`);
                    }
                });

                td.appendChild(select);
            }

            tr.appendChild(td);
            //---

            // Подсказка поддержки на вход ---
            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let img = document.createElement("img");
            img.classList.add(_CSS_IMG_SIZES.IMG_SIZE_32_CLASS_ID)
            img.src = doesSupportForIn !== null && doesSupportForIn !== undefined
                ? doesSupportForIn
                    ? img.src = _IMG_SRCS.OTHER.ACCEPT
                    : img.src = _IMG_SRCS.OTHER.DENY
                : img.src = _IMG_SRCS.OTHER.QUESTION;
            divContentCenter.appendChild(img);

            td = document.createElement("td");
            td.style.background = doesSupportForIn !== null && doesSupportForIn !== undefined
                ? doesSupportForIn
                    ? _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID
                    : _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID
                : _CSS_ROOT.YELLOW_LIGHT_COLOR_STYLE_ID;
            td.appendChild(divContentCenter);

            tr.appendChild(td);
            //---

            // Подсказка поддержки на выход ---
            divContentCenter = divContentCenter.cloneNode(false);

            img = img.cloneNode(false);
            img.src = doesSupportForOut !== null && doesSupportForOut !== undefined
                ? doesSupportForOut
                    ? img.src = _IMG_SRCS.OTHER.ACCEPT
                    : img.src = _IMG_SRCS.OTHER.DENY
                : img.src = _IMG_SRCS.OTHER.QUESTION;
            divContentCenter.appendChild(img);

            td = document.createElement("td");
            td.style.background = doesSupportForOut !== null && doesSupportForOut !== undefined
                ? doesSupportForOut
                    ? _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID
                    : _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID
                : _CSS_ROOT.YELLOW_LIGHT_COLOR_STYLE_ID;
            td.appendChild(divContentCenter);

            tr.appendChild(td);
            //---
        }

        return tr;
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
                self.startToFill();
            })
        }

        let selectElementBooleanIsActiveForIn = this.#selectElementBooleanIsActiveForIn;
        if (selectElementBooleanIsActiveForIn) {
            if (!selectElementBooleanIsActiveForIn.getIsPrepared()) {
                selectElementBooleanIsActiveForIn.prepare();
                await selectElementBooleanIsActiveForIn.fill();
            }

            let select = selectElementBooleanIsActiveForIn.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, function() {
                    self.startToFill();
                })
            }
        }

        let selectElementBooleanIsActiveForOut = this.#selectElementBooleanIsActiveForOut;
        if (selectElementBooleanIsActiveForOut) {
            if (!selectElementBooleanIsActiveForOut.getIsPrepared()) {
                selectElementBooleanIsActiveForOut.prepare();
                await selectElementBooleanIsActiveForOut.fill();
            }

            let select = selectElementBooleanIsActiveForOut.getSelect();
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
                let selectElementBooleanIsActiveForIn = self.#selectElementBooleanIsActiveForIn;
                if (selectElementBooleanIsActiveForIn) {
                    await selectElementBooleanIsActiveForIn.refresh(true);
                }

                let selectElementBooleanIsActiveForOut = self.#selectElementBooleanIsActiveForOut;
                if (selectElementBooleanIsActiveForOut) {
                    await selectElementBooleanIsActiveForOut.refresh(true);
                }
            });
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            })
        }
    }


    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Получаем данные для поиска ---
        let title;
        let inputTextElementFinder = this.#inputTextElementFinder;
        if (inputTextElementFinder) {
            title = inputTextElementFinder.getValue();
        }

        let isActiveForIn;
        let selectElementBooleanIsActiveForIn = this.#selectElementBooleanIsActiveForIn;
        if (selectElementBooleanIsActiveForIn) {
            isActiveForIn = selectElementBooleanIsActiveForIn.getSelectedValue();
        }

        let isActiveForOut;
        let selectElementBooleanIsActiveForOut = this.#selectElementBooleanIsActiveForOut;
        if (selectElementBooleanIsActiveForOut) {
            isActiveForOut = selectElementBooleanIsActiveForOut.getSelectedValue();
        }

        let maxNumberOfLangsOnPage = this.#maxNumberOfLangsOnPage;
        let lastLangIdOnPreviousPage = this.getValueForNextPage();
        //---

        // Ищем языки Yandex.Dictionary, чтобы выводить подсказки по поддержке языков ---
        let yandexDictionaryLangsResponseDTO;
        let jsonResponse = await _LANGS_API.GET.getYandexDictionaryLangs();
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            yandexDictionaryLangsResponseDTO = new YandexDictionaryLangsResponseDTO(jsonResponse.getJson());
        } else {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }
        //---

        if (yandexDictionaryLangsResponseDTO) {
            jsonResponse = await _LANGS_API.GET.getAll(
                title, isActiveForIn, isActiveForOut, maxNumberOfLangsOnPage, lastLangIdOnPreviousPage);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                trsArr = [];

                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    if (!this.getFindStatus()) break;
                    let langResponseDTO = new LangResponseDTO(json[i]);

                    let tr = await this.#createTr(langResponseDTO, yandexDictionaryLangsResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }

                    if (i === json.length - 1) {
                        this.setValueForNextPage(langResponseDTO.getId());
                    }
                }

                // Генерируем кнопку "Показать больше" ---
                if (this.getFindStatus() && maxNumberOfLangsOnPage === json.length) {
                    let tr = this.createTrShowMore(`Показать ещё ${maxNumberOfLangsOnPage} языков`);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
                //---
            } else if (giveAccessToShowMessage) {
                this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                    _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
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

        let selectElementBooleanIsActiveForIn = this.#selectElementBooleanIsActiveForIn;
        if (selectElementBooleanIsActiveForIn) {
            selectElementBooleanIsActiveForIn.changeDisabledStatus(isDisabled);
        }

        let selectElementBooleanIsActiveForOut = this.#selectElementBooleanIsActiveForOut;
        if (selectElementBooleanIsActiveForOut) {
            selectElementBooleanIsActiveForOut.changeDisabledStatus(isDisabled);
        }
    }
}