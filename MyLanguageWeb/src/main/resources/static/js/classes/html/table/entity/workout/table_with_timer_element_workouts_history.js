import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/elements/div/css_div_element.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    AButtonWithImgElementSizes
} from "../../../a/a_button/with_img/a_button_with_img_element_sizes.js";

import {
    AButtonWithImgElementTypes
} from "../../../a/a_button/with_img/a_button_with_img_element_types.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    HrefTypes
} from "../../../a/href_types.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    DivElementWorkoutInfo
} from "../../../div/entity/workout/info/div_element_workout_info.js";

import {
    AButtonWithImgElement
} from "../../../a/a_button/with_img/a_button_with_img_element.js";

import {
    DateResponseDTO
} from "../../../../dto/other/response/value/date_response_dto.js";

import {
    WorkoutResponseDTO
} from "../../../../dto/entity/workout/response/workout_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    EventNames
} from "../../../event_names.js";

import {
    TimeParts
} from "../../../time_parts.js";

import {
    DateParts
} from "../../../date_parts.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();

const _HTTP_STATUSES = new HttpStatuses();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTON_WITH_IMG_ELEMENT_SIZES = new AButtonWithImgElementSizes();
const _A_BUTTON_WITH_IMG_ELEMENT_TYPES = new AButtonWithImgElementTypes();
const _URL_PATHS = new UrlPaths();
const _HREF_TYPES = new HrefTypes();
const _EVENT_NAMES = new EventNames();

export class TableWithTimerElementWorkoutsHistory extends TableWithTimerAbstractElement {
    #customerId;
    #selectElementWorkoutTypes;
    #buttonElementRefresh;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    setSelectElementWorkoutTypes(selectElementWorkoutTypesObj) {
        this.#selectElementWorkoutTypes = selectElementWorkoutTypesObj;
    }

    setButtonElementRefresh(buttonElementRefreshObj) {
        this.#buttonElementRefresh = buttonElementRefreshObj;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let customerId = this.#customerId;
        if (!customerId) {
            isCorrect = false;
            this.showMessage("Не удалось получить id владельца страницы", _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
    }

    async #createTr(workoutResponseDTOObj) {
        let tr;
        if (workoutResponseDTOObj) {
            tr = document.createElement("tr");

            // Порядковый номер ---
            let td = document.createElement("td");
            td.style.textAlign = "center";

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Тренировка ---
            td = document.createElement("td");

            let divElementWorkoutInfo = new DivElementWorkoutInfo(null);
            divElementWorkoutInfo.setWorkoutResponseDTO(workoutResponseDTOObj);
            divElementWorkoutInfo.setDoNeedToShowSpanElementCustomer(false);

            await divElementWorkoutInfo.prepare();
            await divElementWorkoutInfo.fill();

            let div = divElementWorkoutInfo.getDiv();
            if (div) {
                td.appendChild(div);
            }

            tr.appendChild(td);
            //---

            // Затраченное время ---
            td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.style.fontSize = _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID;
            td.textContent = new TimeParts(workoutResponseDTOObj.getCurrentMilliseconds()).getTimeStr(
                false, true, true, false);

            tr.appendChild(td);
            //---

            // Действия ---
            td = document.createElement("td");

            let divActions = document.createElement("div");
            divActions.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let aButtonWithImgElement = new AButtonWithImgElement(null, null);
            aButtonWithImgElement.changeAButtonWithImgElementSize(_A_BUTTON_WITH_IMG_ELEMENT_SIZES.SIZE_32);
            aButtonWithImgElement.changeTo(_A_BUTTON_WITH_IMG_ELEMENT_TYPES.INFO);
            aButtonWithImgElement.changeTitle(`Информация о тренировке №${workoutResponseDTOObj.getId()}`);

            let href = _URL_PATHS.WORKOUTS.INFO.createFullPath();
            aButtonWithImgElement.changeHref(`${href}/${workoutResponseDTOObj.getId()}`);
            aButtonWithImgElement.changeHrefType(_HREF_TYPES.OPEN_IN_NEW_PAGE);

            let a = aButtonWithImgElement.getA();
            if (a) {
                divActions.appendChild(a);
            }

            td.appendChild(divActions);
            tr.appendChild(td);
            //---
        }

        return tr;
    }


    async prepare() {
        await super.prepare();

        let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
        if (selectElementWorkoutTypes) {
            if (!selectElementWorkoutTypes.getIsPrepared()) {
                await selectElementWorkoutTypes.prepare();
                await selectElementWorkoutTypes.fill();
            }

            let select = selectElementWorkoutTypes.getSelect();
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
                let selectElementWorkoutTypes = self.#selectElementWorkoutTypes;
                if (selectElementWorkoutTypes) {
                    await selectElementWorkoutTypes.refresh(true);
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

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            // Получаем данные для поиска ---
            let workoutTypeCode;
            let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
            if (selectElementWorkoutTypes) {
                workoutTypeCode = selectElementWorkoutTypes.getSelectedValue();
            }

            let customerId = this.#customerId;

            let dateOfEnd = this.getValueForNextPage();
            if (!dateOfEnd) {
                let jsonResponse = await _WORKOUTS_API.GET.findMaxDateOfEnd(workoutTypeCode, customerId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    dateOfEnd = new DateResponseDTO(jsonResponse.getJson()).getValue();
                }
            }
            //---

            let jsonResponse = await _WORKOUTS_API.GET.getAllOver(workoutTypeCode, dateOfEnd, customerId);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                trsArr = [];

                // Создаём строку с датой ---
                if (dateOfEnd) {
                    let dateMessage;

                    let datePartsDateOfEnd = new DateParts(dateOfEnd);
                    let datePartsToday = new DateParts(new Date());
                    if (datePartsDateOfEnd.getDateStr() === datePartsToday.getDateStr()) {
                        dateMessage = "Сегодня";
                    }

                    if (!dateMessage) {
                        let datePartsYesterday = new DateParts(new Date(
                            new Date().setDate(
                                new Date().getDate() - 1)));
                        if (datePartsDateOfEnd.getDateStr() === datePartsYesterday.getDateStr()) {
                            dateMessage = "Вчера";
                        }
                    }

                    if (!dateMessage) {
                        dateMessage = datePartsDateOfEnd.getDateStr();
                    }

                    let tr = _TABLE_UTILS.createTrWithMessage(dateMessage, _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID,
                        this.getNumberOfColumns(), false);
                    if (tr) {
                        tr.style.fontWeight = "bold";
                        trsArr.push(tr);
                    }
                }
                //---

                // Генерируем строки с тренировками в рамках найденной даты ---
                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    let workoutResponseDTO = new WorkoutResponseDTO(json[i]);

                    let tr = await this.#createTr(workoutResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
                //---

                // Ищем следующую дату ---
                jsonResponse = await _WORKOUTS_API.GET.findNextDateOfEnd(dateOfEnd, workoutTypeCode, customerId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    // Если мы нашли следующую дату, мы должны сохранить её для следующей страницы ---
                    dateOfEnd = new DateResponseDTO(jsonResponse.getJson()).getValue();
                    this.setValueForNextPage(dateOfEnd);
                    //---

                    // Сбрасываем счетчик строк ---
                    this.setCurrentRowNumber(0);
                    //--

                    // Генерируем кнопку "Показать больше" ---
                    let message;

                    let datePartsDateOfEnd = new DateParts(dateOfEnd);
                    let datePartsYesterday = new DateParts(new Date(
                        new Date().setDate(
                            new Date().getDate() - 1)));
                    if (datePartsDateOfEnd.getDateStr() === datePartsYesterday.getDateStr()) {
                        message = "Показать вчерашние тренировки";
                    }

                    if (!message) {
                        message = `Показать тренировки за ${datePartsDateOfEnd.getDateStr()}`;
                    }

                    let tr = this.createTrShowMore(message);
                    if (tr) {
                        trsArr.push(tr);
                    }
                    //---
                }
                //---
            } else {
                this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                    _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
            }

            return trsArr;
        }
    }


    changeDisabledStatusToTableInstruments(isDisabled) {
        let buttonElementRefresh = this.#buttonElementRefresh;
        if (buttonElementRefresh) {
            buttonElementRefresh.changeDisabledStatus(isDisabled);
        }

        let selectElementWorkoutTypes = this.#selectElementWorkoutTypes;
        if (selectElementWorkoutTypes) {
            selectElementWorkoutTypes.changeDisabledStatus(isDisabled);
        }
    }
}