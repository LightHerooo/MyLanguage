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
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    YandexDictionaryLangsResponseDTO
} from "../../../../dto/entity/lang/other/yandex_dictionary_langs.js";

import {
    LangResponseDTO
} from "../../../../dto/entity/lang/response/lang_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _LANGS_API = new LangsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_IMG_SIZES = new CssImgSizes();

const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();

export class TableWithTimerElementNewLangs extends TableWithTimerAbstractElement {
    #buttonElementRefresh;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    #createTr(langCode, yandexDictionaryLangsResponseDTOObj) {
        let tr;
        if (langCode && yandexDictionaryLangsResponseDTOObj) {
            // Проверяем поддержку на вход и выход с помощью Yandex.Dictionary ---
            let doesSupportForIn = yandexDictionaryLangsResponseDTOObj.isExistsLangInCode(langCode);
            let doesSupportForOut = yandexDictionaryLangsResponseDTOObj.isExistsLangOutCode(langCode);
            //---

            tr = document.createElement("tr");

            // Номер строки ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber()
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Код языка ---
            td = document.createElement("td");
            td.textContent = langCode;

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
            buttonElementRefresh.setAfterRefreshFunction(function() {
                self.startToFill();
                self.changeDisabledStatusToTableInstruments(false);
            })
        }
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        // Ищем языки Yandex.Dictionary, чтобы выводить подскази по поддержке языков ---
        let jsonResponse = await _LANGS_API.GET.getYandexDictionaryLangs();
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let yandexDictionaryLangsResponseDTO = new YandexDictionaryLangsResponseDTO(jsonResponse.getJson());

            // Мы должны оставить только те языки, которые отсутствуют в базе ---
            let langCodes = yandexDictionaryLangsResponseDTO.getLangCodes();
            jsonResponse = await _LANGS_API.GET.getAll(
                null, null, null, 0, 0);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    let lang = new LangResponseDTO(json[i]);

                    let langIndex = langCodes.indexOf(lang.getCode());
                    if (langIndex !== -1) {
                        langCodes.splice(langIndex, 1);
                    }
                }
            }
            //---

            if (langCodes.length > 0) {
                trsArr = [];

                for (let i = 0; i < langCodes.length; i++) {
                    let tr = this.#createTr(langCodes[i], yandexDictionaryLangsResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
            } else if (giveAccessToShowMessage) {
                this.showMessage("Новых языков не найдено", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
            }
        } else if (giveAccessToShowMessage) {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }
        //---

        return trsArr;
    }

    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }
    }
}