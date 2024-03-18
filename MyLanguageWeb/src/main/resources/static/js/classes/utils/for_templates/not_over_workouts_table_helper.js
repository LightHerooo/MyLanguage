import {
    CustomTimer
} from "../../custom_timer/custom_timer.js";

import {
    LoadingElement
} from "../../loading_element.js";

import {
    CssMain
} from "../../css/css_main.js";

import {
    CssRoot
} from "../../css/css_root.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    AButtons
} from "../../a_buttons/a_buttons.js";

import {
    ResourceUrls
} from "../../resource_urls.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WorkoutsAPI
} from "../../api/workouts_api.js";

import {
    WorkoutRequestDTO,
    WorkoutResponseDTO
} from "../../dto/entity/workout.js";

import {
    LongResponse
} from "../../dto/other/long_response.js";

import {
    WorkoutRoundStatisticResponseDTO
} from "../../dto/types/workout_round_statistic.js";

import {
    TimeParts
} from "../../time_parts.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    AButtonImgSizes
} from "../../a_buttons/a_button_img_sizes.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();
const _A_BUTTONS = new AButtons();
const _RESOURCE_URLS = new ResourceUrls();
const _GLOBAL_COOKIES = new GlobalCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

const _MAX_NUMBER_OF_NOT_OVER_WORKOUTS = 3;

export class NotOverWorkoutsTableHelper {
    #containerId;
    #workoutTypeCode;
    #changeDisableStatusFunction;
    #customerTimerFinder;

    constructor(containerId, workoutTypeCode, changeDisableStatusFunction) {
        this.#containerId = containerId;
        this.#workoutTypeCode = workoutTypeCode;
        this.#changeDisableStatusFunction = changeDisableStatusFunction;

        this.#customerTimerFinder = this.#createCustomTimerFinder();
    }

    #createCustomTimerFinder() {
        let thisClass = this;

        let customTimer = new CustomTimer();
        customTimer.setTimeout(1000);
        customTimer.setHandler(async function() {
            let currentFinder = thisClass.getCustomTimerFinder();

            // Пытаемся сгенерировать таблицу активных тренировок ---
            let notOverWorkoutsTable =
                await thisClass.#createNotOverWorkoutsTable();
            //---

            // Добавляем в контейнер таблицу / отображаем сообщение (информацию) ---
            let div = document.getElementById(thisClass.#containerId);
            if (notOverWorkoutsTable && div && currentFinder.getActive() === true) {
                div.replaceChildren();
                div.className = "";

                if (currentFinder.getActive() === true) {
                    div.appendChild(notOverWorkoutsTable);
                }
            } else {
                thisClass.#showError("Произошла ошибка поиска незавершённых тренировок.");
            }
            //---
        });

        return customTimer;
    }

    #showError(errorMessage) {
        let currentFinder = this.getCustomTimerFinder();

        let div = document.getElementById(this.#containerId);
        if (div && currentFinder.getActive() === true) {
            div.replaceChildren();
            div.className = "";
            div.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            div.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

            if (currentFinder.getActive === true) {
                let ruleElement = new RuleElement(div, div);
                ruleElement.message = errorMessage;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
                ruleElement.showRule();
            }
        }
    }

    async #createNotOverWorkoutsTable() {
        // Исправляем повреждённые тренировки ---
        let dto = new WorkoutRequestDTO();
        dto.workoutTypeCode = this.#workoutTypeCode;

        await _WORKOUTS_API.PATCH.repairNotOver(dto);
        //---

        // Ищем активные тренировки ---
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await _WORKOUTS_API.GET
            .getNotOverByCustomerIdAndWorkoutTypeCode(authId, this.#workoutTypeCode);
        //---

        // Если мы не нашли ни одной тренировки, мы должны отобразить три пустых слота ---
        let isCorrect = true;
        let workoutsJson;
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            let message = new CustomResponseMessage(JSONResponse.json);
            if (message.id !== 999) {
                isCorrect = false;
            }
        } else {
            workoutsJson = JSONResponse.json;
        }
        //---

        let notOverWorkoutsTable;
        if (isCorrect === true) {
            notOverWorkoutsTable = document.createElement("table");
            notOverWorkoutsTable.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

            // Создаём colgroup + trHeader
            // В зависимости от наличия данных, мы должны наращивать колонки будущей таблицы ---
            let colgroup = document.createElement("colgroup");
            let col = document.createElement("col");
            col.style.width = "100%";

            let trHeader = document.createElement("tr");
            let thHeader = document.createElement("th");
            //---

            let isHeaderReady = false;
            let activeWorkoutRows = [];
            for (let i = 0; i < _MAX_NUMBER_OF_NOT_OVER_WORKOUTS; i++) {
                if (workoutsJson && i < workoutsJson.length) {
                    let workout = new WorkoutResponseDTO(workoutsJson[i]);

                    // Создаём строку тренировки ---
                    let trWorkout = document.createElement("tr");
                    let tdContent = document.createElement("td");
                    //---

                    // Данные о тренировке ---
                    tdContent = tdContent.cloneNode(false);
                    tdContent.appendChild(workout.createDivInfo());
                    trWorkout.appendChild(tdContent);

                    if (isHeaderReady === false) {
                        col = col.cloneNode(false);
                        col.style.width = "100%";
                        colgroup.appendChild(col);

                        thHeader = thHeader.cloneNode(false);
                        thHeader.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
                        thHeader.textContent = "Данные о тренировке"
                        trHeader.appendChild(thHeader);
                    }
                    //---

                    // Текущий раунд ---
                    let currentRoundNumber;
                    JSONResponse = await _WORKOUTS_API.GET.findCurrentRoundNumberByWorkoutId(workout.id);
                    if (JSONResponse.status === _HTTP_STATUSES.OK) {
                        currentRoundNumber = new LongResponse(JSONResponse.json).value;

                        tdContent = tdContent.cloneNode(false);
                        tdContent.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
                        tdContent.style.textAlign = "center";
                        tdContent.textContent = currentRoundNumber;
                        trWorkout.appendChild(tdContent);

                        if (isHeaderReady === false) {
                            col = document.createElement("col");
                            col.style.width = "150px";
                            colgroup.appendChild(col);

                            thHeader = thHeader.cloneNode(false);
                            thHeader.textContent = "Текущий раунд";
                            trHeader.appendChild(thHeader);
                        }
                    }
                    //---

                    // Осталось вопросов ---
                    if (currentRoundNumber) {
                        JSONResponse = await _WORKOUTS_API.GET
                            .findRoundStatisticByWorkoutIdAndRoundNumber(workout.id, currentRoundNumber);
                        if (JSONResponse.status === _HTTP_STATUSES.OK) {
                            let currentRoundStatistic =
                                new WorkoutRoundStatisticResponseDTO(JSONResponse.json);

                            tdContent = tdContent.cloneNode(false);
                            tdContent.textContent = currentRoundStatistic.numberOfQuestionsWithoutAnswer;
                            trWorkout.appendChild(tdContent);

                            if (isHeaderReady === false) {
                                col = col.cloneNode(true);
                                colgroup.appendChild(col);

                                thHeader = thHeader.cloneNode(false);
                                thHeader.textContent = "Осталось вопросов";
                                trHeader.appendChild(thHeader);
                            }
                        }
                    }
                    //---

                    // Время ---
                    tdContent = tdContent.cloneNode(false);
                    tdContent.textContent = new TimeParts(workout.currentMilliseconds)
                        .getTimeStr(false, true, true, false);
                    trWorkout.appendChild(tdContent);

                    if (isHeaderReady === false) {
                        col = col.cloneNode(true);
                        colgroup.appendChild(col);

                        thHeader = thHeader.cloneNode(false);
                        thHeader.textContent = "Время"
                        trHeader.appendChild(thHeader);
                    }
                    //---

                    // Действия ---
                    let divActions = document.createElement("div");
                    divActions.style.display = "grid";
                    divActions.style.grid = "1fr 1fr / 1fr";
                    divActions.style.gap = "5px";

                    let thisClass = this;
                    let aButtonImgSize = _A_BUTTON_IMG_SIZES.SIZE_32;
                    let aContinue = _A_BUTTONS.A_BUTTON_ARROW_RIGHT.createA(aButtonImgSize);
                    aContinue.title = "Продолжить тренировку";
                    aContinue.addEventListener("click", async function () {
                        thisClass.#changeDisableStatusFunction(true);

                        let dto = new WorkoutRequestDTO();
                        dto.id = workout.id;

                        JSONResponse = await _WORKOUTS_API.PATCH.changeActivity(dto);
                        if (JSONResponse.status === _HTTP_STATUSES.OK) {
                            window.location.replace(_RESOURCE_URLS.WORKOUTS_START);
                        } else {
                            thisClass.#changeDisableStatusFunction(false);
                            thisClass.#showError(new CustomResponseMessage(JSONResponse.json).text);
                        }
                    });
                    divActions.appendChild(aContinue);

                    let aDelete = _A_BUTTONS.A_BUTTON_DENY.createA(aButtonImgSize);
                    aDelete.title = "Удалить тренировку";
                    aDelete.addEventListener("click", async function () {
                        thisClass.showLoading();

                        dto = new WorkoutRequestDTO();
                        dto.id = workout.id;

                        JSONResponse = await _WORKOUTS_API.DELETE.delete(dto);
                        if (JSONResponse.status === _HTTP_STATUSES.OK) {
                            thisClass.startToBuildTable();
                        }
                    });
                    divActions.appendChild(aDelete);

                    tdContent = tdContent.cloneNode(false);
                    tdContent.appendChild(divActions);
                    trWorkout.appendChild(tdContent);

                    if (isHeaderReady === false) {
                        col = col.cloneNode(true);
                        col.style.width = "80px";
                        colgroup.appendChild(col);

                        thHeader = thHeader.cloneNode(false);
                        trHeader.appendChild(thHeader);
                    }
                    //---

                    // Добавляем в массив сгенерированную строку ---
                    activeWorkoutRows.push(trWorkout);
                    isHeaderReady = true;
                    //---
                } else {
                    let tdEmptySlot = document.createElement("td");
                    tdEmptySlot.colSpan = colgroup.childElementCount;

                    let divEmptySlot = document.createElement("div");
                    divEmptySlot.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
                    divEmptySlot.style.textAlign = "center";
                    divEmptySlot.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
                    divEmptySlot.textContent = `Пустой слот №${i + 1}`
                    tdEmptySlot.appendChild(divEmptySlot);

                    let trEmptySlot = document.createElement("tr");
                    trEmptySlot.style.height = "150px";
                    trEmptySlot.appendChild(tdEmptySlot);

                    activeWorkoutRows.push(trEmptySlot);
                }
            }

            // Добавляем colgroup + tHead, если он готов ---
            if (isHeaderReady === true) {
                notOverWorkoutsTable.appendChild(colgroup);

                let tHead = document.createElement("thead");
                tHead.appendChild(trHeader);

                notOverWorkoutsTable.appendChild(tHead);
            }
            //---

            // Добавляем tBody ---
            let tBody = document.createElement("tbody");
            for (let row of activeWorkoutRows) {
                tBody.appendChild(row);
            }

            notOverWorkoutsTable.appendChild(tBody);
            //---
        }

        return notOverWorkoutsTable;
    }

    getCustomTimerFinder() {
        return this.#customerTimerFinder;
    }

    showLoading() {
        let div = document.getElementById(this.#containerId);
        if (div) {
            div.replaceChildren();
            div.className = "";
            div.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            div.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

            let loadingElement = new LoadingElement();
            div.appendChild(loadingElement.createDiv());
        }
    }

    startToBuildTable() {
        let currentFinder = this.getCustomTimerFinder();
        if (currentFinder) {
            currentFinder.stop();
        }

        this.showLoading();

        if (currentFinder) {
            currentFinder.start();
        }
    }
}