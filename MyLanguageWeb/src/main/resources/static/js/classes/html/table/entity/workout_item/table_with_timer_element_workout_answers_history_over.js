import {
    WorkoutItemsAPI
} from "../../../../api/entity/workout_items_api.js";

import {
    WorkoutsAPI
} from "../../../../api/entity/workouts_api.js";

import {
    CssRoot
} from "../../../../css/css_root.js";

import {
    CssDivElement
} from "../../../../css/div/css_div_element.js";

import {
    CssSpanElement
} from "../../../../css/span/css_span_element.js";

import {
    CssImgSizes
} from "../../../../css/css_img_sizes.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    TableUtils
} from "../../table_utils.js";

import {
    TableWithTimerAbstractElement
} from "../../abstracts/table_with_timer_abstract_element.js";

import {
    DivElementWorkoutRoundStatisticOver
} from "../../../div/entity/workout/round/div_element_workout_round_statistic_over.js";

import {
    WorkoutItemResponseDTO
} from "../../../../dto/entity/workout_item/response/workout_item_response_dto.js";

import {
    ValueResponseDTO
} from "../../../../dto/other/response/value/value_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _WORKOUT_ITEMS_API = new WorkoutItemsAPI();
const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_DIV_ELEMENT = new CssDivElement();
const _CSS_SPAN_ELEMENT = new CssSpanElement();
const _CSS_IMG_SIZES = new CssImgSizes();

const _HTTP_STATUSES = new HttpStatuses();
const _TABLE_UTILS = new TableUtils();
const _IMG_SRCS = new ImgSrcs();

export class TableWithTimerElementWorkoutAnswersHistoryOver extends TableWithTimerAbstractElement {
    #workoutResponseDTO;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (!workoutResponseDTO) {
            isCorrect = false;
            this.showMessage("Не удалось отобразить историю ответов по тренировке",
                _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
        }

        if (isCorrect) {
            if (!workoutResponseDTO.getDateOfEnd()) {
                isCorrect = false;
                this.showMessage("Историю ответов по тренировке можно получить только после её окончания",
                    _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID);
            }
        }

        return isCorrect;
    }

    #getColorStyle(workoutItemResponseDTOObj) {
        let colorStyle;
        if (workoutItemResponseDTOObj) {
            colorStyle = workoutItemResponseDTOObj.getIsCorrect()
                ? _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID
                : _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
        }

        return colorStyle;
    }

    #createTrWithQuestion(workoutItemResponseDTOObj) {
        let tr;

        if (workoutItemResponseDTOObj) {
            tr = document.createElement("tr");

            // Определяем цвет для колонок ---
            let colorStyle = this.#getColorStyle(workoutItemResponseDTOObj);
            //---

            // Номер строки ---
            let td = document.createElement("td");
            td.style.background = colorStyle;
            td.style.textAlign = "center";
            td.rowSpan = 2;

            this.incrementCurrentRowNumber();
            td.textContent = `${this.getCurrentRowNumber()}.`;

            tr.appendChild(td);
            //---

            // Колонка подсказки ---
            td = document.createElement("td");
            td.style.background = colorStyle;

            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let span = document.createElement("span");
            span.classList.add(_CSS_SPAN_ELEMENT.SPAN_ELEMENT_FOR_HINT_CLASS_ID);
            span.title = "Вопрос";
            span.textContent = "?";
            divContentCenter.appendChild(span);

            td.appendChild(divContentCenter);
            tr.appendChild(td);
            //---

            // Колонка вопроса ---
            td = td.cloneNode(false);

            let question = workoutItemResponseDTOObj.getQuestion();
            if (!question) {
                question = "Нет вопроса";
            }
            td.textContent = question;

            tr.appendChild(td);
            //---

            // Колонка изображения корректности ---
            td = td.cloneNode(false);
            td.rowSpan = 2;

            divContentCenter = divContentCenter.cloneNode(false);

            let img = document.createElement("img");
            img.classList.add(_CSS_IMG_SIZES.IMG_SIZE_32_CLASS_ID);
            img.src = workoutItemResponseDTOObj.getIsCorrect()
                ? _IMG_SRCS.OTHER.ACCEPT
                : _IMG_SRCS.OTHER.DENY;
            divContentCenter.appendChild(img);

            td.appendChild(divContentCenter);
            tr.appendChild(td);
            //---
        }

        return tr;
    }

    #createTrWithAnswer(workoutItemResponseDTOObj) {
        let tr;

        if (workoutItemResponseDTOObj) {
            tr = document.createElement("tr");

            // Определяем цвет для колонок ---
            let colorStyle = this.#getColorStyle(workoutItemResponseDTOObj);
            //---

            // Колонка подсказки ---
            let td = document.createElement("td");
            td.style.background = colorStyle;

            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);

            let span = document.createElement("span");
            span.classList.add(_CSS_SPAN_ELEMENT.SPAN_ELEMENT_FOR_HINT_CLASS_ID);
            span.title = "Ответ";
            span.textContent = "!";
            divContentCenter.appendChild(span);

            td.appendChild(divContentCenter);
            tr.appendChild(td);
            //---

            // Колонка ответа ---
            td = td = td.cloneNode(false);

            let answer = workoutItemResponseDTOObj.getAnswer();
            if (!answer) {
                answer = "Нет ответа";
            }
            td.textContent = answer;

            tr.appendChild(td);
            //---
        }

        return tr;
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            // Получаем данные для поиска ---
            let workoutId;
            let workoutResponseDTO = this.#workoutResponseDTO;
            if (workoutResponseDTO) {
                workoutId = workoutResponseDTO.getId();
            }

            let currentRoundNumber = this.getValueForNextPage();
            if (!currentRoundNumber) {
                currentRoundNumber = 1;
            }
            //---

            let jsonResponse = await _WORKOUT_ITEMS_API.GET.getAll(workoutId, true, currentRoundNumber);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                trsArr = [];

                // Генерируем строку статистики просматриваемого раунда ---
                let divElementWorkoutRoundStatisticOver =
                    new DivElementWorkoutRoundStatisticOver(null);
                divElementWorkoutRoundStatisticOver.setWorkoutId(workoutId);
                divElementWorkoutRoundStatisticOver.setRoundNumber(currentRoundNumber);

                await divElementWorkoutRoundStatisticOver.prepare();
                await divElementWorkoutRoundStatisticOver.fill();

                let div = divElementWorkoutRoundStatisticOver.getDiv();
                if (div) {
                    let tr = _TABLE_UTILS.createTrWithAnyElement(
                        div, this.getNumberOfColumns(), true);
                    if (tr) {
                        trsArr.push(tr);
                    }
                }
                //---

                // Генерируем строки ответов ---
                let json = jsonResponse.getJson();
                for (let i = 0; i < json.length; i++) {
                    let workoutItemResponseDTO = new WorkoutItemResponseDTO(json[i]);

                    // Вопрос ---
                    let tr = this.#createTrWithQuestion(workoutItemResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }
                    //---

                    // Ответ ---
                    tr = this.#createTrWithAnswer(workoutItemResponseDTO);
                    if (tr) {
                        trsArr.push(tr);
                    }
                    //---
                }
                //---

                // Сбрасываем счетчик строк ---
                this.setCurrentRowNumber(0);
                //--

                // Генерируем кнопку "Показать больше" ---
                jsonResponse = await _WORKOUTS_API.GET.findMaxRoundNumber(workoutId);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let maxRoundNumber = new ValueResponseDTO(jsonResponse.getJson()).getValue();
                    if (maxRoundNumber && currentRoundNumber < maxRoundNumber) {
                        let nextRoundNumber = currentRoundNumber + 1;

                        let message = `Показать историю ответов за раунд №${nextRoundNumber}`;
                        let tr = this.createTrShowMore(message);
                        if (tr) {
                            trsArr.push(tr);
                        }

                        this.setValueForNextPage(nextRoundNumber);
                    }
                }
                //---
            } else {
                this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                    _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID)
            }
        }

        return trsArr;
    }
}