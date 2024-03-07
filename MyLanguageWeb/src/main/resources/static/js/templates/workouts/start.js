import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    WorkoutsAPI
} from "../../classes/api/workouts_api.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WorkoutRequestDTO,
    WorkoutResponseDTO
} from "../../classes/dto/entity/workout.js";

import {
    RuleElement
} from "../../classes/rule/rule_element.js";

import {
    RuleTypes
} from "../../classes/rule/rule_types.js";

import {
    LongResponse
} from "../../classes/dto/other/long_response.js";

import {
    CustomTimerTicker
} from "../../classes/custom_timer/custom_timer_ticker.js";

import {
    WorkoutRoundStatisticResponseDTO
} from "../../classes/dto/types/workout_round_statistic.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    TimeParts
} from "../../classes/time_parts.js";

import {
    ImageSources
} from "../../classes/image_sources.js";

import {
    WorkoutItemsAPI
} from "../../classes/api/workout_items_api.js";

import {
    AnswerResultResponseDTO,
    WorkoutItemRequestDTO,
    WorkoutItemResponseDTO
} from "../../classes/dto/entity/workout_item.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    ResourceUrls
} from "../../classes/resource_urls.js";

import {
    ButtonUtils
} from "../../classes/utils/button_utils.js";

import {
    Hotkeys
} from "../../classes/hotkeys.js";

import {
    HtmlElementUtils
} from "../../classes/utils/html_element_utils.js";

import {
    FlagElements
} from "../../classes/flag_elements.js";

const _WORKOUTS_API = new WorkoutsAPI();
const _WORKOUT_ITEMS_API = new WorkoutItemsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _GLOBAL_COOKIES = new GlobalCookies();
const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _IMAGE_SOURCES = new ImageSources();
const _RESOURCE_URLS = new ResourceUrls();
const _BUTTON_UTILS = new ButtonUtils();
const _HTML_ELEMENT_UTILS = new HtmlElementUtils();
const _HOTKEYS = new Hotkeys();
const _FLAG_ELEMENTS = new FlagElements();

const _DIV_START_WORKOUT_INFO_ITEM_WITH_HEADER_CONTAINER_STYLE_ID =
    "start-workout-info-item-with-header-container";
const _DIV_START_WORKOUT_INFO_ITEM_HEADER_CONTAINER_STYLE_ID = "start-workout-info-item-header-container";
const _IMG_WORKOUT_INFO_ITEM_HEADER_STYLE_ID = "img-workout-info-item-header";

const _DIV_START_WORKOUT_INTERACTION_WITH_ANSWER_AREA_STYLE_ID = "start-workout-interaction-with-answer-area";
const _DIV_ANSWER_CONTAINER_STYLE_ID = "answer-container";

const _DIV_WORKOUT_INFO_ID = "div_workout_info";
const _DIV_TIMER_INFO_ID = "div_timer_info";
const _DIV_ROUND_INFO_ID = "div_round_info";
const _DIV_INTERACTION_CONTAINER_ID = "div_interaction_container";

const _DIV_ANSWERS_HISTORY_CONTAINER = "div_answers_history_container";
const _DIV_ANSWERS_HISTORY = "div_answers_history";
const _TABLE_ANSWERS_HISTORY = "table_current_round_history";
const _TBODY_ANSWERS_HISTORY = "tbody_current_round_history";

let _currentWorkout;
let _currentRound = -1n;
let _workoutRoundStatistic;
let _lastAnswerNumberInAnswersHistory = 1;

let _customTimerTickerWorkoutTimer;

window.onload = async function () {
    // Отображаем загрузки во всех контейнерах ---
    showLoadingInAllContainers();
    //---

    // Пытаемся найти текущую тренировку (с отображением информации о ней) и создать таймер ---
    _currentWorkout = await tryToFindCurrentWorkout();
    _customTimerTickerWorkoutTimer = await tryToCreateCustomTimerTicker();
    //---

    // Подготавливаем тренировку к очередному раунду ---
    await prepareWorkoutRound();
    //---
}

window.onbeforeunload = async function() {
    if (_currentWorkout && _customTimerTickerWorkoutTimer) {
        let dto = new WorkoutRequestDTO();
        dto.id = _currentWorkout.id;
        dto.currentMilliseconds = _customTimerTickerWorkoutTimer.getMilliseconds();

        await _WORKOUTS_API.PATCH.setCurrentMilliseconds(dto);
    }
}

function showLoadingInWorkoutDynamicContainers() {
    showLoadingInRoundInfo();
    showLoadingInAnswersHistory();
    showLoadingInInteractionContainer();
}

function showLoadingInAllContainers() {
    let loadingElement = new LoadingElement();

    let divWorkoutTypeInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
    if (divWorkoutTypeInfo) {
        divWorkoutTypeInfo.replaceChildren();
        divWorkoutTypeInfo.className = "";
        divWorkoutTypeInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutTypeInfo.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        divWorkoutTypeInfo.appendChild(loadingElement.createDiv());
    }

    let divTimer = document.getElementById(_DIV_TIMER_INFO_ID);
    if (divTimer) {
        divTimer.textContent = "00:00";
    }

    showLoadingInWorkoutDynamicContainers();
}

function showErrorInWorkoutDynamicContainers(message) {
    showErrorInRoundInfo(message);
    showErrorInAnswersHistory(message);
    showErrorInInteractionContainer(message);
}

function showErrorInAllContainers(message) {
    // Информация о тренировке ---
    let divWorkoutInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
    if (divWorkoutInfo) {
        divWorkoutInfo.replaceChildren();

        let ruleElement = new RuleElement(divWorkoutInfo, divWorkoutInfo);
        ruleElement.message = message;
        ruleElement.ruleType = _RULE_TYPES.ERROR;
        ruleElement.showRule();
    }
    //---

    // Секундомер ---
    let divTimer = document.getElementById(_DIV_TIMER_INFO_ID);
    if (divTimer) {
        divTimer.textContent = "NaN";
    }
    //---

    showErrorInWorkoutDynamicContainers(message);
}

// Работа с важными объектами для тренировки ---
async function tryToFindCurrentWorkout() {
    let currentWorkout;

    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let JSONResponse = await _WORKOUTS_API.GET.findLastInactiveByCustomerId(authId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        currentWorkout = new WorkoutResponseDTO(JSONResponse.json);

        // Меняем активность тренировки ---
        let dto = new WorkoutRequestDTO();
        dto.id = currentWorkout.id;
        JSONResponse = await _WORKOUTS_API.PATCH.changeActivity(dto);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            currentWorkout = new WorkoutResponseDTO(JSONResponse.json);

            // Устанавливаем информацию о тренировке
            let divWorkoutInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
            if (divWorkoutInfo) {
                divWorkoutInfo.replaceChildren();
                divWorkoutInfo.className = "";
                divWorkoutInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divWorkoutInfo.style.display = "grid";
                divWorkoutInfo.style.justifyContent = "left";
                divWorkoutInfo.style.alignItems = "center";
                divWorkoutInfo.appendChild(currentWorkout.createDivInfo());
            }
        } else {
            currentWorkout = null;
        }
        //---
    }

    return currentWorkout;
}

async function tryToCreateCustomTimerTicker() {
    let customTimerTicker;

    let divTimer = document.getElementById(_DIV_TIMER_INFO_ID);
    if (_currentWorkout && divTimer) {
        let startMilliseconds = _currentWorkout.currentMilliseconds;

        // Создаём функцию изменения времени ---
        let changeTimeFunction = function () {
            let tickerMilliseconds;
            if (_customTimerTickerWorkoutTimer) {
                tickerMilliseconds = _customTimerTickerWorkoutTimer.getMilliseconds();
            } else {
                tickerMilliseconds = startMilliseconds
            }

            let timeParts = new TimeParts(tickerMilliseconds);
            divTimer.textContent = timeParts.getTimeStr(
                false, true, true, false);
        }
        //---

        // Вызываем функцию изменения времени один раз, чтобы установить начальное время ---
        changeTimeFunction();
        //---

        // Создаём таймер, который будет менять время в контейнере, помещаем его в тикер ---
        let workoutTimer = new CustomTimer();
        workoutTimer.setTimeout(100);
        workoutTimer.setHandler(changeTimeFunction);
        //---

        // Создаём тикер ---
        customTimerTicker = new CustomTimerTicker(workoutTimer, startMilliseconds);
        //---
    }

    return customTimerTicker;
}

function checkCorrectValuesInImportantVariables() {
    let isCorrect = true;
    let message;

    if (!_currentWorkout) {
        isCorrect = false;
        message = "Не удалось загрузить информацию о раунде.";
    } else if (_currentRound <= 0n) {
        isCorrect = false;
        message = "Не удалось получить текущий раунд.";
    }

    if (isCorrect === false) {
        showErrorInWorkoutDynamicContainers(message);
    }

    return isCorrect;
}
//---

// Информация о раунде ---
function showLoadingInRoundInfo() {
    let loadingElement = new LoadingElement();

    let divRoundInfo = document.getElementById(_DIV_ROUND_INFO_ID);
    if (divRoundInfo) {
        divRoundInfo.replaceChildren();
        divRoundInfo.className = "";
        divRoundInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divRoundInfo.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divRoundInfo.appendChild(loadingElement.createDiv());
    }
}

function showErrorInRoundInfo(message) {
    let divRoundInfo = document.getElementById(_DIV_ROUND_INFO_ID);
    if (divRoundInfo) {
        divRoundInfo.replaceChildren();

        let ruleElement = new RuleElement(divRoundInfo, divRoundInfo);
        ruleElement.message = message;
        ruleElement.ruleType = _RULE_TYPES.ERROR;
        ruleElement.showRule();
    }
}

async function showCurrentRoundInfo() {
    let isCorrect = false;

    let divRoundInfo = document.getElementById(_DIV_ROUND_INFO_ID);
    if (divRoundInfo) {
        isCorrect = checkCorrectValuesInImportantVariables();
        if (isCorrect === true) {
            let message;

            let JSONResponse = await _WORKOUTS_API.GET
                .findRoundStatisticByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRound);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _workoutRoundStatistic =
                    new WorkoutRoundStatisticResponseDTO(JSONResponse.json);
            } else {
                isCorrect = false;
                message = new CustomResponseMessage(JSONResponse.json).text;
            }

            if (!_workoutRoundStatistic) {
                showErrorInRoundInfo(message);
            } else {
                // Чистим контейнер, меняем стиль ---
                divRoundInfo.replaceChildren();
                divRoundInfo.className = "";
                divRoundInfo.classList.add(_DIV_START_WORKOUT_INFO_ITEM_WITH_HEADER_CONTAINER_STYLE_ID);
                //---

                // Создаём заголовок ---
                let divHeader = document.createElement("div");
                divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divHeader.classList.add(_DIV_START_WORKOUT_INFO_ITEM_HEADER_CONTAINER_STYLE_ID);

                let imgHeader = document.createElement("img");
                imgHeader.src = _IMAGE_SOURCES.OTHER.FLAME;
                imgHeader.classList.add(_IMG_WORKOUT_INFO_ITEM_HEADER_STYLE_ID);
                divHeader.appendChild(imgHeader);

                let spanHeaderText = document.createElement("span");
                spanHeaderText.textContent = `${_currentRound}-й раунд`;
                divHeader.appendChild(spanHeaderText);

                divRoundInfo.appendChild(divHeader);
                //---

                // Добавляем контейнер статистики раунда ---
                divRoundInfo.appendChild(_workoutRoundStatistic.createDivNotOver());
                //---
            }
        }
    }

    return isCorrect;
}
//---

// История ответов в раунде ---
function showLoadingInAnswersHistory() {
    let loadingElement = new LoadingElement();

    let divAnswersHistoryContainer = document.getElementById(_DIV_ANSWERS_HISTORY_CONTAINER);
    if (divAnswersHistoryContainer) {
        divAnswersHistoryContainer.replaceChildren();
        divAnswersHistoryContainer.className = "";
        divAnswersHistoryContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divAnswersHistoryContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divAnswersHistoryContainer.appendChild(loadingElement.createDiv());
    }
}

function showErrorInAnswersHistory(message) {
    let divAnswersHistoryContainer = document.getElementById(_DIV_ANSWERS_HISTORY_CONTAINER);
    if (divAnswersHistoryContainer) {
        divAnswersHistoryContainer.replaceChildren();

        let ruleElement = new RuleElement(divAnswersHistoryContainer, divAnswersHistoryContainer);
        ruleElement.message = message;
        ruleElement.ruleType = _RULE_TYPES.ERROR;
        ruleElement.showRule();
    }
}

async function showCurrentRoundAnswersHistory() {
    let isCorrect = false;

    let divAnswersHistoryContainer = document.getElementById(_DIV_ANSWERS_HISTORY_CONTAINER);
    if (divAnswersHistoryContainer) {
        isCorrect = checkCorrectValuesInImportantVariables();
        if (isCorrect === true) {
            let notFoundText;
            let JSONResponse = await _WORKOUT_ITEMS_API.GET
                .getWithAnswerByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRound);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                let badRequest = new CustomResponseMessage(JSONResponse.json);
                if (badRequest.id === 999) {
                    notFoundText = badRequest.text;
                } else {
                    isCorrect = false;
                    showErrorInAnswersHistory(badRequest.text);
                }
            }

            if (isCorrect === true) {
                divAnswersHistoryContainer.replaceChildren();
                divAnswersHistoryContainer.className = "";
                divAnswersHistoryContainer.classList.add(_DIV_START_WORKOUT_INFO_ITEM_WITH_HEADER_CONTAINER_STYLE_ID);

                // Генерируем заголовом контейнера ---
                let divHeader = document.createElement("div");
                divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divHeader.classList.add(_DIV_START_WORKOUT_INFO_ITEM_HEADER_CONTAINER_STYLE_ID);

                let imgHeader = document.createElement("img");
                imgHeader.classList.add(_IMG_WORKOUT_INFO_ITEM_HEADER_STYLE_ID);
                imgHeader.src = _IMAGE_SOURCES.OTHER.HISTORY;
                divHeader.appendChild(imgHeader);

                let spanHeader = document.createElement("span");
                spanHeader.textContent = "История";
                divHeader.appendChild(spanHeader);

                divAnswersHistoryContainer.appendChild(divHeader);
                //---

                // Генерируем контейнер с историей ---
                let divAnswersHistory = document.createElement("div");
                divAnswersHistory.id = _DIV_ANSWERS_HISTORY;
                divAnswersHistory.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divAnswersHistory.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
                divAnswersHistoryContainer.appendChild(divAnswersHistory);

                if (notFoundText) {
                    let divMessage = document.createElement("div");
                    divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
                    divMessage.style.textAlign = "center";
                    divMessage.textContent = notFoundText;
                    divAnswersHistory.appendChild(divMessage);
                } else {
                    let json = JSONResponse.json;
                    for (let i = 0; i < json.length; i++) {
                        let workoutItem = new WorkoutItemResponseDTO(json[i]);
                        addAnswerToAnswersHistory(workoutItem);
                    }
                }
                //---
            }
        }
    }

    return isCorrect;
}

function createTableCurrentRoundHistory() {
    let table = document.createElement("table");
    table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);
    table.style.margin = "0 -5px";
    table.id = _TABLE_ANSWERS_HISTORY;

    // Создаём colgroup ---
    let colgroup = document.createElement("colgroup");

    let colNum = document.createElement("col");
    colNum.style.width = "70px";
    colgroup.appendChild(colNum);

    let colHelp = document.createElement("col");
    colHelp.style.width = "50px";
    colgroup.appendChild(colHelp);

    let colResult = document.createElement("col");
    colResult.style.width = "100%";
    colgroup.appendChild(colResult);

    let colImg = document.createElement("col");
    colImg.style.width = "50px";
    colgroup.appendChild(colImg);

    table.appendChild(colgroup);
    //---

    // Создаём tBody ---
    let tBody = document.createElement("tbody");
    tBody.id = _TBODY_ANSWERS_HISTORY;

    table.appendChild(tBody);
    //---

    return table;
}

function addAnswerToAnswersHistory(workoutItemObj) {
    let divAnswersHistory = document.getElementById(_DIV_ANSWERS_HISTORY);
    if (!divAnswersHistory) {
        divAnswersHistory = document.createElement("div");
        divAnswersHistory.id = _DIV_ANSWERS_HISTORY;

        let divAnswersHistoryContainer = document.getElementById(_DIV_ANSWERS_HISTORY_CONTAINER);
        if (divAnswersHistoryContainer) {
            divAnswersHistoryContainer.appendChild(divAnswersHistory);
        }
    }

    let tableAnswersHistory = document.getElementById(_TABLE_ANSWERS_HISTORY);
    if (!tableAnswersHistory) {
        divAnswersHistory.replaceChildren();

        divAnswersHistory.className = "";
        divAnswersHistory.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divAnswersHistory.classList.add(_CSS_MAIN.DIV_OVERFLOW_Y_STANDARD_STYLE_ID);

        divAnswersHistory.appendChild(createTableCurrentRoundHistory());
    }

    let tBodyAnswersHistory = document.getElementById(_TBODY_ANSWERS_HISTORY);
    if (tBodyAnswersHistory) {
        let trQuestion = workoutItemObj.createTrQuestion(
            _lastAnswerNumberInAnswersHistory++, false);
        tBodyAnswersHistory.appendChild(trQuestion);
    }

    divAnswersHistory.scrollTop = divAnswersHistory.scrollHeight;
}
//---

// Контейнер взаимодействия (начало раунда, вопрос + ввод ответа, выход при системной ошибке) ---
function showLoadingInInteractionContainer() {
    // Останавливаем таймер ---
    if (_customTimerTickerWorkoutTimer) {
        _customTimerTickerWorkoutTimer.stop();
    }
    //---

    let loadingElement = new LoadingElement();

    let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
    if (divInteractionContainer) {
        divInteractionContainer.replaceChildren();
        divInteractionContainer.className = "";
        divInteractionContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divInteractionContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divInteractionContainer.appendChild(loadingElement.createDiv());
    }
}

function showErrorInInteractionContainer(message) {
    // Останавливаем таймер ---
    if (_customTimerTickerWorkoutTimer) {
        _customTimerTickerWorkoutTimer.stop();
    }
    //---

    let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
    if (divInteractionContainer) {
        divInteractionContainer.replaceChildren();
        divInteractionContainer.className = "";
        divInteractionContainer.classList.add(_DIV_START_WORKOUT_INTERACTION_WITH_ANSWER_AREA_STYLE_ID);

        // Блок с ошибкой ---
        let divErrorMessage = document.createElement("div");
        divErrorMessage.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divErrorMessage.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divErrorMessage.id = "div_interaction_container_error";

        let ruleElement = new RuleElement(divErrorMessage, divErrorMessage);
        ruleElement.message = message;
        ruleElement.ruleType = _RULE_TYPES.ERROR;
        ruleElement.showRule();

        divInteractionContainer.appendChild(divErrorMessage);
        //---

        // Кнопка возвращения на страницу тренировок ---
        let btnRedirect = document.createElement("button");
        btnRedirect.classList.add(_CSS_MAIN.BUTTON_STANDARD_STYLE_ID);
        btnRedirect.textContent = "Вернуться на страницу тренировок";
        btnRedirect.addEventListener("click", function () {
            window.onbeforeunload = null;
            window.location.replace(_RESOURCE_URLS.WORKOUTS);
        })

        _BUTTON_UTILS.addHotkey(btnRedirect, _HOTKEYS.ENTER, function () {
            let event = new Event("click");
            btnRedirect.dispatchEvent(event);
        }, true);

        divInteractionContainer.appendChild(btnRedirect);
        btnRedirect.focus();
        //---
    }
}

async function prepareNextQuestion() {
    showLoadingInInteractionContainer();

    let JSONResponse = await _WORKOUT_ITEMS_API.GET
        .getRandomWithoutAnswerByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRound);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let workoutItem = new WorkoutItemResponseDTO(JSONResponse.json);

        await prepareInteractionContainerForSendAnswer(workoutItem);
    } else {
        let message = new CustomResponseMessage(JSONResponse.json);
        if (message.id === 999) {
            await prepareWorkoutRound();
        } else {
            showErrorInInteractionContainer(message.text);
        }
    }
}

async function prepareInteractionContainerForStartRound() {
    let isCorrect = false;

    let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
    if (divInteractionContainer) {
        isCorrect = checkCorrectValuesInImportantVariables();
        if (isCorrect === true) {
            // Проверяем новизну раунда ---
            let isNewRound = true;
            let JSONResponse = await _WORKOUT_ITEMS_API.GET
                .getCountWithAnswerByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRound);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                isNewRound = new LongResponse(JSONResponse.json).value === 0n;
            }
            //---

            // В зависимости от новизны рануда, генерим текст ---
            let actionText = isNewRound === true ? "Начать" : "Продолжить";
            //---

            // Генерируем контейнер с сообщением, которое будет во всех динамических контейнерах до начала раунда ---
            let divMessage = document.createElement("div");
            divMessage.style.textAlign = "center";
            //---

            // Устанавливаем собщение в контейнер информации о раунде ---
            let divRoundInfo = document.getElementById(_DIV_ROUND_INFO_ID);
            if (divRoundInfo) {
                divRoundInfo.replaceChildren();
                divRoundInfo.className = "";
                divRoundInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divRoundInfo.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

                let divMessageClone = divMessage.cloneNode(true);
                divMessageClone.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
                divMessageClone.textContent = `Нажмите кнопку "${actionText}", 
                    чтобы получить статистику ${_currentRound}-го раунда.`;

                divRoundInfo.appendChild(divMessageClone);
            }
            //---

            // Устанавливаем собщение в контейнер истории ответов раунда ---
            let divAnswersHistoryContainer = document.getElementById(_DIV_ANSWERS_HISTORY_CONTAINER);
            if (divAnswersHistoryContainer) {
                divAnswersHistoryContainer.replaceChildren();
                divAnswersHistoryContainer.className = "";
                divAnswersHistoryContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divAnswersHistoryContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

                let divMessageClone = divMessage.cloneNode(true);
                divMessageClone.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
                divMessageClone.textContent = `Нажмите кнопку "${actionText}", 
                    чтобы отобразить историю ответов ${_currentRound}-го раунда.`;

                divAnswersHistoryContainer.appendChild(divMessageClone);
            }
            //---

            // Устанавливаем сообщение в контейнер взаимодействия + создаём кнопку для старта ---
            let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
            if (divInteractionContainer) {
                divInteractionContainer.replaceChildren();
                divInteractionContainer.className = "";
                divInteractionContainer.classList.add(_DIV_START_WORKOUT_INTERACTION_WITH_ANSWER_AREA_STYLE_ID);

                // Создаём контейнер, в котором будет информация о начале раунда ---
                let divStartRoundInfoContainer = document.createElement("div");
                divStartRoundInfoContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divStartRoundInfoContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

                let divMessageClone = divMessage.cloneNode(true);
                divMessageClone.style.fontSize = _CSS_ROOT.FIRST_FONT_SIZE;
                divMessageClone.textContent = `Нажмите кнопку "${actionText}", 
                    чтобы запустить ${_currentRound}-й раунд.`;

                divStartRoundInfoContainer.appendChild(divMessageClone);
                divInteractionContainer.appendChild(divStartRoundInfoContainer);
                //---

                // Создаём кнопку начала раунда ---
                let btnAction = document.createElement("button");
                btnAction.classList.add(_CSS_MAIN.BUTTON_STANDARD_STYLE_ID);
                btnAction.textContent = actionText;
                btnAction.addEventListener("click", async function () {
                    showLoadingInWorkoutDynamicContainers();
                    await showCurrentRoundInfo();
                    await showCurrentRoundAnswersHistory();
                    await prepareNextQuestion();
                });

                _BUTTON_UTILS.addHotkey(btnAction, _HOTKEYS.ENTER, function () {
                    let event = new Event("click");
                    btnAction.dispatchEvent(event);
                }, true);

                divInteractionContainer.appendChild(btnAction);
                btnAction.focus();
                //---
            }
            //---
        }
    }

    return isCorrect;
}

function checkCorrectAnswerValue(tbAnswer, parentElement) {
    const MAX_ANSWER_LENGTH = 44;

    let isCorrect = false;
    if (tbAnswer) {
        let ruleElement = new RuleElement(tbAnswer, parentElement);

        let answer = tbAnswer.value.trim();
        if (answer.length > MAX_ANSWER_LENGTH) {
            isCorrect = false;
            ruleElement.message = `Ответ не должен быть больше ${MAX_ANSWER_LENGTH}-х символов.`;
            ruleElement.ruleType = _RULE_TYPES.ERROR;
        } else {
            isCorrect = true;
        }

        if (isCorrect === false) {
            ruleElement.showRule();
        } else {
            ruleElement.removeRule();
        }
    }

    return isCorrect;
}

async function prepareInteractionContainerForSendAnswer(workoutItem) {
    showLoadingInInteractionContainer();

    let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
    if (divInteractionContainer) {
        if (workoutItem) {
            // Запускаем таймер ---
            if (_customTimerTickerWorkoutTimer) {
                _customTimerTickerWorkoutTimer.start();
            }
            //---

            // Очищаем контейнер от предыдущих элементов ---
            divInteractionContainer.replaceChildren();
            divInteractionContainer.className = "";
            divInteractionContainer.classList.add(_DIV_START_WORKOUT_INTERACTION_WITH_ANSWER_AREA_STYLE_ID);
            //---

            // Поле с вопросом ---
            let divQuestion = document.createElement("div");
            divQuestion.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            divQuestion.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divQuestion.style.fontSize = _CSS_ROOT.FIRST_FONT_SIZE;
            divQuestion.textContent = workoutItem.wordTitleQuestion;

            divInteractionContainer.appendChild(divQuestion);
            //---

            // Контейнер для ввода ответа ---
            let divAnswerContainer = document.createElement("div");
            divAnswerContainer.classList.add(_DIV_ANSWER_CONTAINER_STYLE_ID);

            // Поле с ответом
            let tbAnswer = document.createElement("input");
            tbAnswer.classList.add(_CSS_MAIN.INPUT_TEXT_STANDARD_STYLE_ID);
            tbAnswer.type = "text";
            tbAnswer.placeholder = "Введите ответ здесь";
            _HTML_ELEMENT_UTILS.addHotkey(tbAnswer, _HOTKEYS.ENTER, function () {
                let event = new Event("click");
                btnSendAnswer.dispatchEvent(event);
            })
            divAnswerContainer.appendChild(tbAnswer);

            // Исходящий флаг
            let divOutFlag = _FLAG_ELEMENTS.DIV.create(_currentWorkout.langOut.code, true);
            let divOutFlagContainer = document.createElement("div");
            divOutFlagContainer.style.paddingBottom = "5px";
            divOutFlagContainer.style.paddingRight = "5px";
            divOutFlagContainer.appendChild(divOutFlag);
            divAnswerContainer.appendChild(divOutFlagContainer);

            // Кнопка "Ответить"
            let btnSendAnswer = document.createElement("button");
            btnSendAnswer.classList.add(_CSS_MAIN.BUTTON_STANDARD_STYLE_ID);
            btnSendAnswer.textContent = "Ответить";
            btnSendAnswer.addEventListener("click", async function () {
                if (checkCorrectAnswerValue(tbAnswer) === true) {
                    tbAnswer.disabled = true;
                    btnSendAnswer.disabled = true;

                    // Сохраняем текущее время (для будущего возобновления тренировки) ---
                    let isCorrect = true;

                    let dto = new WorkoutRequestDTO();
                    dto.id = _currentWorkout.id;
                    dto.currentMilliseconds = _customTimerTickerWorkoutTimer.getMilliseconds();

                    let JSONResponse = await _WORKOUTS_API.PATCH.setCurrentMilliseconds(dto);
                    if (JSONResponse.status === _HTTP_STATUSES.OK) {
                        _currentWorkout = new WorkoutResponseDTO(JSONResponse.json);
                    } else {
                        isCorrect = false;

                        let message = new CustomResponseMessage(JSONResponse.json);
                        showErrorInInteractionContainer(message.text);
                    }
                    //---

                    if (isCorrect === true) {
                        await prepareInteractionContainerForShowResult(workoutItem.id, tbAnswer.value);
                    }
                }
            });

            _BUTTON_UTILS.addHotkey(btnSendAnswer, _HOTKEYS.ENTER, function () {
                let event = new Event("click");
                btnSendAnswer.dispatchEvent(event);
            }, true);
            divAnswerContainer.appendChild(btnSendAnswer);
            //---

            // Добавляем созданный контейнер в дополнительный (для корректного отображения предупреждения) ---
            let divAnswerContainerVerticalFlex = document.createElement("div");
            divAnswerContainerVerticalFlex.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            divAnswerContainerVerticalFlex.style.display = "flex";
            divAnswerContainerVerticalFlex.style.flexDirection = "column";
            divAnswerContainerVerticalFlex.style.justifyContent = "center";
            divAnswerContainerVerticalFlex.style.gap = "5px";
            divAnswerContainerVerticalFlex.appendChild(divAnswerContainer);

            tbAnswer.addEventListener("input", function () {
                checkCorrectAnswerValue(this, divAnswerContainerVerticalFlex);
            });

            divInteractionContainer.appendChild(divAnswerContainerVerticalFlex);
            tbAnswer.focus();
            //---
        } else {
            showErrorInInteractionContainer("Произошла ошибка отображения вопроса.");
        }
    }
}

async function prepareInteractionContainerForShowResult(workoutItemId, answer) {
    // Проверяем ответ ---
    let dto = new WorkoutItemRequestDTO();
    dto.id = workoutItemId;
    dto.wordTitleAnswer = answer;

    let JSONResponse = await _WORKOUT_ITEMS_API.PATCH.setAnswer(dto);
    //---

    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let answerResult = new AnswerResultResponseDTO(JSONResponse.json);

        // Добавляем ответ в историю ---
        let divAnswersHistory = document.getElementById(_DIV_ANSWERS_HISTORY);
        if (divAnswersHistory) {
            addAnswerToAnswersHistory(answerResult.workoutItem);
        }
        //---

        // Меняем статистику ---
        if (_workoutRoundStatistic) {
            _workoutRoundStatistic.changeStatistic(answerResult.isCorrect);
        }
        //---

        // Копируем слово в следующий раунд, если найдены переводы и ответ неверный ---
        if (answerResult.possibleAnswers && answerResult.isCorrect === false) {
            let dto = new WorkoutItemRequestDTO();
            dto.id = answerResult.workoutItem.id;
            JSONResponse = await _WORKOUT_ITEMS_API.POST.addToNextRound(dto);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                let message = new CustomResponseMessage(JSONResponse.json).text;
                showErrorInInteractionContainer(message);
            }
        }
        //---

        let divInteractionContainer = document.getElementById(_DIV_INTERACTION_CONTAINER_ID);
        if (divInteractionContainer) {
            divInteractionContainer.replaceChildren();
            divInteractionContainer.className = "";
            divInteractionContainer.classList.add(_DIV_START_WORKOUT_INTERACTION_WITH_ANSWER_AREA_STYLE_ID);

            // Поле с ответом ---
            let divAnswerResultData = document.createElement("div");

            // Надпись "Правильно/Неправильно"
            let divResultTextHeader = document.createElement("div");
            divResultTextHeader.style.fontSize = _CSS_ROOT.FIRST_FONT_SIZE;
            divResultTextHeader.style.fontWeight = "bold";
            divResultTextHeader.textContent = answerResult.message;

            divAnswerResultData.appendChild(divResultTextHeader);

            // Вопрос -> Ответ
            let spanResultQuestionWithAnswerLeft = document.createElement("span");
            spanResultQuestionWithAnswerLeft.style.fontWeight = "bold";
            spanResultQuestionWithAnswerLeft.style.textDecoration = "underline dotted";
            spanResultQuestionWithAnswerLeft.title = "Вопрос -> Ответ";
            spanResultQuestionWithAnswerLeft.textContent = "[?/!]";

            let questionText = answerResult.workoutItem.wordTitleQuestion
                ? answerResult.workoutItem.wordTitleQuestion
                : "Нет вопроса";
            let answerText = answerResult.workoutItem.wordTitleAnswer
                ? answerResult.workoutItem.wordTitleAnswer
                : "Нет ответа";

            let spanResultQuestionWithAnswerRight = document.createElement("span");
            spanResultQuestionWithAnswerRight.textContent = ` ${questionText} -> ${answerText}`;

            let divResultQuestionWithAnswer = document.createElement("div");
            divResultQuestionWithAnswer.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divResultQuestionWithAnswer.appendChild(spanResultQuestionWithAnswerLeft);
            divResultQuestionWithAnswer.appendChild(spanResultQuestionWithAnswerRight);
            divAnswerResultData.appendChild(divResultQuestionWithAnswer);

            // Другие переводы
            if (answerResult.possibleAnswers) {
                if (answerResult.possibleAnswers.length > 0) {
                    let spanOtherTranslatesLeft = document.createElement("span");
                    spanOtherTranslatesLeft.style.fontWeight = "bold";
                    spanOtherTranslatesLeft.textContent = answerResult.isCorrect === true
                        ? "Другие ответы: "
                        : "Правильные ответы: ";

                    let spanOtherTranslatesRight = document.createElement("span");
                    spanOtherTranslatesRight.textContent = answerResult.getPossibleAnswersStr();

                    let divOtherTranslates = document.createElement("div");
                    divOtherTranslates.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
                    divOtherTranslates.style.opacity = _CSS_ROOT.OPACITY_STANDARD;
                    divOtherTranslates.appendChild(spanOtherTranslatesLeft);
                    divOtherTranslates.appendChild(spanOtherTranslatesRight);

                    divAnswerResultData.appendChild(divOtherTranslates);
                }
            } else {
                let divWarning = document.createElement("div");
                divWarning.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
                divWarning.textContent = "Этот вопрос не будет добавлен в следующий раунд.";
                divAnswerResultData.appendChild(divWarning);
            }

            // Основной контейнер
            let divAnswerResult = document.createElement("div");
            divAnswerResult.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divAnswerResult.style.textAlign = "center";
            divAnswerResult.style.background = answerResult.isCorrect === true
                ? `rgba(${_CSS_ROOT.ACCEPT_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`
                : `rgba(${_CSS_ROOT.DENY_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
            divAnswerResult.appendChild(divAnswerResultData);

            divInteractionContainer.appendChild(divAnswerResult);
            //---

            // Кнопка перехода к следующему вопросу ---
            let btnNextQuestion = document.createElement("button");
            btnNextQuestion.classList.add(_CSS_MAIN.BUTTON_STANDARD_STYLE_ID);
            btnNextQuestion.textContent = "Следующий вопрос";
            btnNextQuestion.addEventListener("click", prepareNextQuestion);

            _BUTTON_UTILS.addHotkey(btnNextQuestion, _HOTKEYS.ENTER, function () {
                let event = new Event("click");
                btnNextQuestion.dispatchEvent(event);
            }, true);

            divInteractionContainer.appendChild(btnNextQuestion);
            btnNextQuestion.focus();
            //---
        }
    } else {
        let message = new CustomResponseMessage(JSONResponse.json);
        showErrorInInteractionContainer(message.text);
    }
}
//---

// Подготовка раунда ---
async function prepareWorkoutRound() {
    if (_currentWorkout) {
        // Отображаем загрузки в некоторых контейнерах ---
        showLoadingInWorkoutDynamicContainers();
        //---

        // Ищем текущий раунд
        // Если вернётся 0, значит раундов не осталось
        // Если вернётся badRequest, то _currentRound = -1n, что будет означать ошибку ---
        _currentRound = -1n;
        if (_currentWorkout) {
            let JSONResponse = await _WORKOUTS_API.GET
                .findCurrentRoundNumberByWorkoutId(_currentWorkout.id);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _currentRound = new LongResponse(JSONResponse.json).value;
            } else {
                let message = new CustomResponseMessage(JSONResponse.json);
                if (message.id === 999) {
                    _currentRound = 0n;
                }
            }
        }
        //---

        // Проверяем текущий раунд ---
        let isCorrect = true;
        if (_currentRound < 0n) {
            isCorrect = checkCorrectValuesInImportantVariables();
        } else if (_currentRound === 0n) {
            let dto = new WorkoutRequestDTO();
            dto.id = _currentWorkout.id;

            let JSONResponse = await _WORKOUTS_API.PATCH.close(dto);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                window.onbeforeunload = null;
                window.location.replace(`${_RESOURCE_URLS.WORKOUTS_INFO}/${_currentWorkout.id}`);
            } else {
                let message = new CustomResponseMessage(JSONResponse.json).text;
                showErrorInInteractionContainer(message);
            }

            isCorrect = false;
        }
        //---

        if (isCorrect === true) {
            // Сбрасываем порядковый номер в списке истории ответов ---
            _lastAnswerNumberInAnswersHistory = 1;
            //---

            // Подготавливаем контейнер взаимодействия с пользователем для начала раунда ---
            await prepareInteractionContainerForStartRound();
            //---
        }
    } else {
        showErrorInAllContainers("Произошла ошибка при поиске тренировки. Попробуйте ещё раз позже.");
    }
}
//---