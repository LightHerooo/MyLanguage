import {
    WorkoutsAPI
} from "../../classes/api/workouts_api.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WorkoutResponseDTO
} from "../../classes/dto/entity/workout.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    RuleElement
} from "../../classes/rule/rule_element.js";

import {
    RuleTypes
} from "../../classes/rule/rule_types.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js"

import {
    ImageSources
} from "../../classes/image_sources.js";

import {
    ResourceUrls
} from "../../classes/resource_urls.js";

import {
    CustomerCollectionRequestDTO, CustomerCollectionResponseDTO
} from "../../classes/dto/entity/customer_collection.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    WorkoutStatisticResponseDTO
} from "../../classes/dto/types/workout_statistic.js";

import {
    WorkoutItemResponseDTO
} from "../../classes/dto/entity/workout_item.js";

import {
    WorkoutItemsAPI
} from "../../classes/api/workout_items_api.js";

import {
    LongResponse
} from "../../classes/dto/other/long_response.js";

import {
    WorkoutRoundStatisticResponseDTO
} from "../../classes/dto/types/workout_round_statistic.js";

const _WORKOUTS_API = new WorkoutsAPI();
const _WORKOUT_ITEMS_API = new WorkoutItemsAPI();
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();
const _DIV_WORKOUT_ACTION_STYLE_ID = "workout-action";
const _IMG_IMG_WORKOUT_ACTION_STYLE_ID = "img-workout-action";
const _DIV_WORKOUT_STATISTICS_CONTAINER_ID = "workout-statistics-container";

const _HTTP_STATUSES = new HttpStatuses();
const _TABLE_UTILS = new TableUtils();
const _RULE_TYPES = new RuleTypes();
const _IMAGE_SOURCES = new ImageSources();
const _RESOURCE_URLS = new ResourceUrls();

const _DIV_WORKOUT_INFO_ID = "div_workout_info";
const _DIV_WORKOUT_EXTRA_ACTIONS_ID = "div_workout_extra_actions";
const _DIV_WORKOUT_STATISTICS_ID = "div_workout_statistics";

const _THEAD_WORKOUT_HISTORY = "thead_workout_history";
const _TBODY_WORKOUT_HISTORY = "tbody_workout_history";

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

let _currentWorkout;
let _isWorkoutEnded = false;
let _currentRoundNumber = 1n;
let _maxRoundNumber = 0n;

window.onload = async function() {
    showLoadingInAllContainers();

    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareWorkoutHistoryFinder();
    //---

    // Пытаемся найти необходимую тренировку ---
    _currentWorkout = await tryToFindCurrentWorkout();
    //---

    tryToFillExtraActions();
    startAllFinders();
}

function showLoadingInAllContainers() {
    showLoadingInDivWorkoutInfo();
    showLoadingInDivWorkoutExtraActions();
    showLoadingInDivWorkoutStatistics();
    showLoadingInWorkoutHistoryTable();
}

function startAllFinders() {
    startToFindStatistic();
    startToFindWorkoutHistory();
}

// Информация о тренировке ---
async function tryToFindCurrentWorkout() {
    let currentWorkout;

    let thisLocation = window.location.href;
    let lastSlashIndex = thisLocation.lastIndexOf("/");
    if (lastSlashIndex > -1) {
        let workoutId = thisLocation.substring(lastSlashIndex + 1);
        let JSONResponse = await _WORKOUTS_API.GET.findById(workoutId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            currentWorkout = new WorkoutResponseDTO(JSONResponse.json);

            // Проверяем, закончена ли тренировка ---
            JSONResponse = await _WORKOUTS_API.GET.validateIsWorkoutEndedByWorkoutId(currentWorkout.id);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _isWorkoutEnded = true;
            }
            //---

            // Устанавливаем информацию о тренировке ---
            let divWorkoutInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
            if (divWorkoutInfo) {
                divWorkoutInfo.replaceChildren();

                divWorkoutInfo.className = "";
                divWorkoutInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divWorkoutInfo.style.display = "grid";
                divWorkoutInfo.style.alignItems = "center";
                divWorkoutInfo.style.justifyContent = "left";
                divWorkoutInfo.appendChild(currentWorkout.createDivInfo());
            }
            //---
        } else {
            showErrorInDivWorkoutInfo(new CustomResponseMessage(JSONResponse.json).text);
        }
    } else {
        showErrorInDivWorkoutInfo("Не удалось получить ID тренировки.");
    }

    return currentWorkout;
}

function showLoadingInDivWorkoutInfo() {
    let divWorkoutInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
    if (divWorkoutInfo) {
        divWorkoutInfo.replaceChildren();

        divWorkoutInfo.className = "";
        divWorkoutInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutInfo.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divWorkoutInfo.appendChild(new LoadingElement().createDiv());
    }
}

function showErrorInDivWorkoutInfo(message) {
    let divWorkoutInfo = document.getElementById(_DIV_WORKOUT_INFO_ID);
    if (divWorkoutInfo) {
        divWorkoutInfo.replaceChildren();

        divWorkoutInfo.className = "";
        divWorkoutInfo.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutInfo.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        let ruleElement = new RuleElement(divWorkoutInfo, divWorkoutInfo);
        ruleElement.message = message;
        ruleElement.ruleType = _RULE_TYPES.ERROR;
        ruleElement.showRule();
    }
}
//---

// Дополнительые действия ---
function showLoadingInDivWorkoutExtraActions() {
    let divWorkoutActions = document.getElementById(_DIV_WORKOUT_EXTRA_ACTIONS_ID);
    if (divWorkoutActions) {
        divWorkoutActions.replaceChildren();

        divWorkoutActions.className = "";
        divWorkoutActions.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutActions.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divWorkoutActions.appendChild(new LoadingElement().createDiv());
    }
}

function tryToFillExtraActions() {
    // Создаём элементы для будущих кнопок событий (из будем клонировать) ---
    let divInsideBtnAction = document.createElement("div");
    divInsideBtnAction.classList.add(_CSS_MAIN.DIV_VERTICAL_FLEX_CONTAINER_STANDARD_STYLE_ID);
    divInsideBtnAction.classList.add(_DIV_WORKOUT_ACTION_STYLE_ID);

    let imgAction = document.createElement("img");
    imgAction.classList.add(_IMG_IMG_WORKOUT_ACTION_STYLE_ID);

    let divActionText = document.createElement("div");

    let aBtnAction = document.createElement("a");
    aBtnAction.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
    //---

    // Кнопка "Новая тренировка" ---
    let aBtnGoToNextWorkout;
    if (_currentWorkout) {
        divInsideBtnAction = divInsideBtnAction.cloneNode(false);

        imgAction = imgAction.cloneNode(false);
        imgAction.src = _currentWorkout.workoutType.pathToImage;
        divInsideBtnAction.appendChild(imgAction);

        divActionText = divActionText.cloneNode(false);
        divActionText.textContent = `Новая тренировка "${_currentWorkout.workoutType.title}"`;
        divInsideBtnAction.appendChild(divActionText);

        aBtnGoToNextWorkout = aBtnAction.cloneNode(false);
        aBtnGoToNextWorkout.appendChild(divInsideBtnAction);
        aBtnGoToNextWorkout.addEventListener("click", function () {
            window.location.replace(`${_RESOURCE_URLS.WORKOUTS}/${_currentWorkout.workoutType.code}`);
        });
    }
    //---

    // Кнопка "Создать новую коллекцию на основе слов тренировки" ---
    let aBtnCreateNewCollectionByWorkoutWords;
    if (_currentWorkout && _currentWorkout.dateOfEnd) {
        divInsideBtnAction = divInsideBtnAction.cloneNode(false);

        imgAction = imgAction.cloneNode(false);
        imgAction.src = _IMAGE_SOURCES.CUSTOMER_COLLECTIONS.BOOKS;
        divInsideBtnAction.appendChild(imgAction);

        divActionText = divActionText.cloneNode(false);
        divActionText.textContent = "Создать новую коллекцию на основе слов тренировки";
        divInsideBtnAction.appendChild(divActionText);

        aBtnCreateNewCollectionByWorkoutWords = aBtnAction.cloneNode(false);
        aBtnCreateNewCollectionByWorkoutWords.appendChild(divInsideBtnAction);

        // Создаём функцию создания коллекции ---
        let createNewCollectionByWorkoutWordsFunction = async function () {
            aBtnCreateNewCollectionByWorkoutWords.className = "";
            aBtnCreateNewCollectionByWorkoutWords.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

            // Пытаемся создать коллекцию ---
            let collectionRequestDTO = new CustomerCollectionRequestDTO();
            collectionRequestDTO.workoutId = _currentWorkout.id;
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.POST.createByWorkoutId(collectionRequestDTO);
            //---

            // Удаляем функцию с нажатия, разблокируем кнопку ---
            aBtnCreateNewCollectionByWorkoutWords.removeEventListener(
                "click", createNewCollectionByWorkoutWordsFunction);

            aBtnCreateNewCollectionByWorkoutWords.className = "";
            aBtnCreateNewCollectionByWorkoutWords.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
            //---

            // Мы должны отобразить результат создания ---
            let divResult = document.createElement("div");
            divResult.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divResult.style.fontWeight = "bold";
            divResult.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let responseDTO = new CustomerCollectionResponseDTO(JSONResponse.json);
                divResult.textContent = `Коллекция "${responseDTO.title}" успешно сгенерирована!`;
            } else {
                divResult.textContent = new CustomResponseMessage(JSONResponse.json).text;
            }

            aBtnCreateNewCollectionByWorkoutWords.replaceChildren();
            aBtnCreateNewCollectionByWorkoutWords.className = "";
            aBtnCreateNewCollectionByWorkoutWords.classList.add(
                JSONResponse.status === _HTTP_STATUSES.OK
                ? _CSS_MAIN.A_BUTTON_ACCEPT_STANDARD_STYLE_ID
                : _CSS_MAIN.A_BUTTON_DENY_STANDARD_STYLE_ID);
            aBtnCreateNewCollectionByWorkoutWords.appendChild(divResult);
            //---
        }
        //---

        // Вешаем созданную функцию на кнопку ---
        aBtnCreateNewCollectionByWorkoutWords.addEventListener("click",
            createNewCollectionByWorkoutWordsFunction);
        //---
    }
    //---

    // Добавляем активности в контейнер ---
    let divWorkoutActions = document.getElementById(_DIV_WORKOUT_EXTRA_ACTIONS_ID);
    if (divWorkoutActions) {
        let actions = [];
        if (aBtnGoToNextWorkout) {
            actions.push(aBtnGoToNextWorkout);
            divWorkoutActions.appendChild(aBtnGoToNextWorkout);
        }
        if (aBtnCreateNewCollectionByWorkoutWords) {
            actions.push(aBtnCreateNewCollectionByWorkoutWords);
            divWorkoutActions.appendChild(aBtnCreateNewCollectionByWorkoutWords);
        }

        if (actions.length > 0) {
            // Генерируем столько столбцов, сколько кнопок событий ---
            let gridTemplateColumnsStr = "";
            for (let action of actions) {
                gridTemplateColumnsStr += "1fr ";
            }
            //---

            divWorkoutActions.replaceChildren();

            divWorkoutActions.className = "";
            divWorkoutActions.style.display = "grid";
            divWorkoutActions.style.grid = "1fr / " + gridTemplateColumnsStr.trim();
            divWorkoutActions.style.gap = "10px";

            for (let action of actions) {
                divWorkoutActions.appendChild(action);
            }
        } else {
            let divMessage = document.createElement("div");
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.style.textAlign = "center";
            divMessage.textContent = "Не удалось сгенерировать дополнительные действия.";

            divWorkoutActions.replaceChildren();
            divWorkoutActions.className = "";
            divWorkoutActions.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            divWorkoutActions.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divWorkoutActions.appendChild(divMessage);
        }
    }
    //---
}
//---

// Статистика ---
function showLoadingInDivWorkoutStatistics() {
    let divWorkoutStatistics = document.getElementById(_DIV_WORKOUT_STATISTICS_ID);
    if (divWorkoutStatistics) {
        divWorkoutStatistics.replaceChildren();

        divWorkoutStatistics.className = "";
        divWorkoutStatistics.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutStatistics.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divWorkoutStatistics.classList.add(_DIV_WORKOUT_STATISTICS_CONTAINER_ID);
        divWorkoutStatistics.appendChild(new LoadingElement().createDiv());
    }
}

function showMessageInDivWorkoutStatistics(message) {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    let divWorkoutStatistics = document.getElementById(_DIV_WORKOUT_STATISTICS_ID);
    if (divWorkoutStatistics) {
        if (currentFinder.getActive() === true) {
            divWorkoutStatistics.replaceChildren();
            if (currentFinder.getActive() === true) {
                divWorkoutStatistics.className = "";
                divWorkoutStatistics.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
                divWorkoutStatistics.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
                divWorkoutStatistics.classList.add(_DIV_WORKOUT_STATISTICS_CONTAINER_ID);

                let divMessage = document.createElement("div");
                divMessage.style.textAlign = "center";
                divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
                divMessage.textContent = message;
                divWorkoutStatistics.appendChild(divMessage);
            }
        }
    }
}

function prepareStatisticFinder() {
    _CUSTOM_TIMER_STATISTIC_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_STATISTIC_FINDER.setHandler(async function () {
        await tryToFillStatistic();
    })
}

function startToFindStatistic() {
    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.stop();
    }

    showLoadingInDivWorkoutStatistics();

    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    if (_currentWorkout) {
        if (_isWorkoutEnded === true) {
            let JSONResponse = await _WORKOUTS_API.GET.findStatisticByWorkoutId(_currentWorkout.id);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let workoutStatistic = new WorkoutStatisticResponseDTO(JSONResponse.json);

                let divWorkoutStatistics = document.getElementById(_DIV_WORKOUT_STATISTICS_ID);
                if (divWorkoutStatistics && currentFinder.getActive() === true) {
                    divWorkoutStatistics.replaceChildren();
                    if (currentFinder.getActive() === true) {
                        divWorkoutStatistics.className = "";
                        divWorkoutStatistics.classList.add(_DIV_WORKOUT_STATISTICS_CONTAINER_ID);
                        divWorkoutStatistics.appendChild(workoutStatistic.createDiv());
                    }
                }
            } else {
                let message = new CustomResponseMessage(JSONResponse.json).text;
                showMessageInDivWorkoutStatistics(message);
            }
        } else {
            showMessageInDivWorkoutStatistics("Статистику по тренировке можно будет посмотреть после её окончания.");
        }
    } else {
        showMessageInDivWorkoutStatistics("Не удалось найти статистику по тренировке.");
    }
}
//---

// История ответов ---
function showLoadingInWorkoutHistoryTable() {
    let tHeadWorkoutHistory = document.getElementById(_THEAD_WORKOUT_HISTORY);
    let tBodyWorkoutHistory = document.getElementById(_TBODY_WORKOUT_HISTORY);
    if (tHeadWorkoutHistory && tBodyWorkoutHistory) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHeadWorkoutHistory);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBodyWorkoutHistory.replaceChildren();
        tBodyWorkoutHistory.appendChild(trLoading);
    }
}

function showMessageInWorkoutHistoryTable(message) {
    let currentFinder = _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER;

    let tHeadWorkoutHistory = document.getElementById(_THEAD_WORKOUT_HISTORY);
    let tBodyWorkoutHistory = document.getElementById(_TBODY_WORKOUT_HISTORY);
    if (tHeadWorkoutHistory && tBodyWorkoutHistory) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHeadWorkoutHistory);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tBodyWorkoutHistory.replaceChildren();
            if (currentFinder.getActive() === true) {
                tBodyWorkoutHistory.appendChild(trMessage);
            }
        }
    }
}

function prepareWorkoutHistoryFinder() {
    _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER.setHandler(async function() {
        await tryToFillWorkoutHistoryTable(true, true);
    });
}

function startToFindWorkoutHistory() {
    if (_CUSTOM_TIMER_WORKOUT_HISTORY_FINDER) {
        _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER.stop();
    }

    showLoadingInWorkoutHistoryTable();

    if (_CUSTOM_TIMER_WORKOUT_HISTORY_FINDER) {
        _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER.start();
    }
}

async function tryToFillWorkoutHistoryTable(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER;

    if (_currentWorkout) {
        if (_isWorkoutEnded === true) {
            // Ищем максимальный номер раунда ---
            let JSONResponse = await _WORKOUTS_API.GET.findMaxRoundNumberByWorkoutId(_currentWorkout.id);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _maxRoundNumber = new LongResponse(JSONResponse.json).value;
            }
            //---

            JSONResponse = await _WORKOUT_ITEMS_API.GET
                .getWithAnswerByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRoundNumber);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let tableRows = await createWorkoutHistoryTableRows(JSONResponse.json);

                let tBodyWorkoutHistory = document.getElementById(_TBODY_WORKOUT_HISTORY);
                if (tableRows && tBodyWorkoutHistory && currentFinder.getActive() === true) {
                    if (doNeedToClearTable === true) {
                        tBodyWorkoutHistory.replaceChildren();
                    }

                    for (let i = 0; i < tableRows.length; i++) {
                        if (currentFinder.getActive() !== true) break;
                        tBodyWorkoutHistory.appendChild(tableRows[i]);
                    }
                }
            } else {
                if (doNeedToShowTableMessage === true) {
                    showMessageInWorkoutHistoryTable(new CustomResponseMessage(JSONResponse.json).text);
                }
            }
        } else {
            if (doNeedToShowTableMessage === true) {
                showMessageInWorkoutHistoryTable(
                    "Историю ответов тренировки можно будет посмотреть после её окончания.");
            }
        }
    } else {
        if (doNeedToShowTableMessage === true) {
            showMessageInWorkoutHistoryTable("Не удалось найти историю ответов тренировки.");
        }
    }
}

async function createWorkoutHistoryTableRows(workoutItemsJson) {
    let currentFinder = _CUSTOM_TIMER_WORKOUT_HISTORY_FINDER;
    let tableRows = [];

    // Создаём строку со статистикой по текущему раунду ---
    let trRoundStatistic;
    let JSONResponse = await _WORKOUTS_API.GET
        .findRoundStatisticByWorkoutIdAndRoundNumber(_currentWorkout.id, _currentRoundNumber);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let roundStatistic = new WorkoutRoundStatisticResponseDTO(JSONResponse.json);

        // Создаём основной контейнер ---
        let divRoundStatisticContainer = document.createElement("div");
        divRoundStatisticContainer.style.display = "grid";
        divRoundStatisticContainer.style.grid = "1fr / 1fr 600px";
        divRoundStatisticContainer.style.gap = "10px";
        //---

        // Создаём левый контейнер с номером раунда ---
        let divRoundNumberContainer = document.createElement("div");
        divRoundNumberContainer.classList.add(_CSS_MAIN.DIV_HORIZONTAL_FLEX_CONTAINER_STANDARD_STYLE_ID);
        divRoundNumberContainer.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        divRoundNumberContainer.style.fontWeight = "bold";

        // Изображение раунда
        let imgRound = document.createElement("img");
        imgRound.style.width = "64px";
        imgRound.style.height = "64px";
        imgRound.src = _IMAGE_SOURCES.OTHER.FLAME;
        divRoundNumberContainer.appendChild(imgRound);

        // Номер раунда
        let divRoundNumber = document.createElement("div");
        divRoundNumber.textContent = `${_currentRoundNumber}-й раунд`;
        divRoundNumberContainer.appendChild(divRoundNumber);

        let divRoundStatisticLeftContainer = document.createElement("div");
        divRoundStatisticLeftContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divRoundStatisticLeftContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divRoundStatisticLeftContainer.appendChild(divRoundNumberContainer);

        divRoundStatisticContainer.appendChild(divRoundStatisticLeftContainer);
        //---

        // Создаём правый контейнер со статистикой раунда ---
        let divRoundStatisticRightContainer = roundStatistic.createDivOver();
        divRoundStatisticContainer.appendChild(divRoundStatisticRightContainer);
        //---

        // Создаём строку с готовым контейнером ---
        let tHeadWorkoutHistory = document.getElementById(_THEAD_WORKOUT_HISTORY);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHeadWorkoutHistory);

        trRoundStatistic = _TABLE_UTILS.createTrWithElementInside(
            numberOfColumns, divRoundStatisticContainer, true,true);
        //---
    }
    //---

    if (trRoundStatistic) {
        tableRows.push(trRoundStatistic);
    }

    for (let i = 0; i < workoutItemsJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
        let workoutItem = new WorkoutItemResponseDTO(workoutItemsJson[i]);
        tableRows.push(workoutItem.createTrQuestion(i + 1, true));
        tableRows.push(workoutItem.createTrAnswer());
    }

    if (currentFinder.getActive() === true
        && _maxRoundNumber !== _currentRoundNumber) {
        let tHeadWorkoutHistory = document.getElementById(_THEAD_WORKOUT_HISTORY);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHeadWorkoutHistory);

        let message =  `Показать историю ответов ${_currentRoundNumber + 1n}-го раунда...`;
        let trShowNextRoundHistory = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function() {
                _currentRoundNumber++;
                await tryToFillWorkoutHistoryTable(false, false);
            });

        tableRows.push(trShowNextRoundHistory);
    }

    return tableRows;
}
//---

