import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    WorkoutTypeUtils
} from "../../classes/utils/entity/workout_type_utils.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CustomersAPI
} from "../../classes/api/customers_api.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CustomerResponseDTO
} from "../../classes/dto/entity/customer.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    WorkoutsAPI
} from "../../classes/api/workouts_api.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    WorkoutsCustomerExtraStatisticResponseDTO
} from "../../classes/dto/types/workout/workouts_customer_extra_statistic.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    DateResponse
} from "../../classes/dto/other/date_response.js";

import {
    DateParts
} from "../../classes/date_parts.js";

import {
    WorkoutResponseDTO
} from "../../classes/dto/entity/workout.js";

import {
    TimeParts
} from "../../classes/time_parts.js";

import {
    AButtons
} from "../../classes/a_buttons/a_buttons.js";

import {
    AButtonImgSizes
} from "../../classes/a_buttons/a_button_img_sizes.js";

import {
    ResourceUrls
} from "../../classes/resource_urls.js";

import {
    ButtonUtils
} from "../../classes/utils/button_utils.js";

const _CUSTOMERS_API = new CustomersAPI();
const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();
const _RESOURCE_URLS = new ResourceUrls();

const _DIV_STATISTIC_CONTAINER_STYLE_ID = "statistic-container";

const _WORKOUT_TYPE_UTILS = new WorkoutTypeUtils();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_UTILS = new ButtonUtils();

const _DIV_STATISTIC_ID = "div_statistic";
const _CB_WORKOUT_TYPES_FOR_STATISTIC_ID = "cb_workout_types_for_statistic";
const _CB_PERIODS_FOR_STATISTIC_ID = "cb_periods_for_statistic";
const _BTN_REFRESH_FOR_STATISTIC_ID = "btn_refresh_for_statistic";

const _CB_WORKOUT_TYPES_FOR_WORKOUTS_ID = "cb_workout_types_for_workouts";
const _BTN_REFRESH_FOR_WORKOUTS_ID = "btn_refresh_for_workouts";

const _THEAD_WORKOUTS_ID = "thead_workouts";
const _TBODY_WORKOUTS_ID = "tbody_workouts";

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORKOUTS_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _CUSTOM_TIMER_FOR_STATISTIC_REFRESH = new CustomTimer();
const _CUSTOM_TIMER_FOR_WORKOUTS_REFRESH = new CustomTimer();

let _currentCustomer;

let _lastWorkoutNumberInList = 0;
let _dateOfEnd;

window.onload = async function() {
    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareWorkoutsFinder();
    //---

    // Пытаемся найти владельца профиля ---
    _currentCustomer = await tryToFindCurrentCustomer();
    //---

    await prepareCbWorkoutTypesForStatistic();
    prepareCbPeriodsForStatistic();
    prepareBtnRefreshForStatistic();

    await prepareCbWorkoutTypesForWorkouts();
    prepareBtnRefreshForWorkouts();


    // Запускаем таймеры ---
    startToFindStatistic();
    startToFindWorkouts();
    //---
}

async function tryToFindCurrentCustomer() {
    let currentCustomer;

    let thisLocation = window.location.href;
    let lastSlashIndex = thisLocation.lastIndexOf("/");
    if (lastSlashIndex > -1) {
        let customerId = thisLocation.substring(lastSlashIndex + 1);
        let JSONResponse = await _CUSTOMERS_API.GET.findById(customerId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            currentCustomer = new CustomerResponseDTO(JSONResponse.json);
        }
    }

    return currentCustomer;
}

async function prepareCbWorkoutTypesForStatistic() {
    let cbWorkoutTypesForStatistic = document.getElementById(_CB_WORKOUT_TYPES_FOR_STATISTIC_ID);
    if (cbWorkoutTypesForStatistic) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _WORKOUT_TYPE_UTILS.CB_WORKOUT_TYPES.prepare(cbWorkoutTypesForStatistic, firstOption);

        cbWorkoutTypesForStatistic.addEventListener("change", startToFindStatistic);
    }
}

function prepareCbPeriodsForStatistic() {
    let cbPeriodsForStatistic = document.getElementById(_CB_PERIODS_FOR_STATISTIC_ID);
    if (cbPeriodsForStatistic) {
        _COMBO_BOX_UTILS.prepareCbPeriods(cbPeriodsForStatistic);

        cbPeriodsForStatistic.addEventListener("change", startToFindStatistic);
    }
}

function prepareBtnRefreshForStatistic() {
    let btnRefreshForStatistic = document.getElementById(_BTN_REFRESH_FOR_STATISTIC_ID);
    if (btnRefreshForStatistic) {
        _BUTTON_UTILS.prepareBtnRefreshWithPromise(btnRefreshForStatistic,
            function () {
                changeDisableStatusToStatisticFinderInstruments(true);

                // Отображаем загрузки ---
                showLoadingInStatistic();
                //---
            },
            async function () {
                let cbWorkoutTypesForStatistic =
                    document.getElementById(_CB_WORKOUT_TYPES_FOR_STATISTIC_ID);
                if (cbWorkoutTypesForStatistic) {
                    let firstOption = document.createElement("option");
                    firstOption.textContent = "Все";

                    await _WORKOUT_TYPE_UTILS.CB_WORKOUT_TYPES.fill(cbWorkoutTypesForStatistic, firstOption);
                }
            },
            function () {
                startToFindStatistic();
                changeDisableStatusToStatisticFinderInstruments(false);
            },
            _CUSTOM_TIMER_FOR_STATISTIC_REFRESH
        );
    }
}

function changeDisableStatusToStatisticFinderInstruments(isDisable) {
    let btnRefreshForStatistic = document.getElementById(_BTN_REFRESH_FOR_STATISTIC_ID);
    if (btnRefreshForStatistic) {
        btnRefreshForStatistic.disabled = isDisable;
    }

    let cbWorkoutTypesForStatistic = document.getElementById(_CB_WORKOUT_TYPES_FOR_STATISTIC_ID);
    if (cbWorkoutTypesForStatistic) {
        cbWorkoutTypesForStatistic.disabled = isDisable;
    }

    let cbPeriodsForStatistic = document.getElementById(_CB_PERIODS_FOR_STATISTIC_ID);
    if (cbPeriodsForStatistic) {
        cbPeriodsForStatistic.disabled = isDisable;
    }
}

async function prepareCbWorkoutTypesForWorkouts() {
    let cbWorkoutTypesForWorkouts = document.getElementById(_CB_WORKOUT_TYPES_FOR_WORKOUTS_ID);
    if (cbWorkoutTypesForWorkouts) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _WORKOUT_TYPE_UTILS.CB_WORKOUT_TYPES.prepare(cbWorkoutTypesForWorkouts, firstOption);

        cbWorkoutTypesForWorkouts.addEventListener("change", startToFindWorkouts);
    }
}

function prepareBtnRefreshForWorkouts() {
    let btnRefreshForWorkouts = document.getElementById(_BTN_REFRESH_FOR_WORKOUTS_ID);
    if (btnRefreshForWorkouts) {
        _BUTTON_UTILS.prepareBtnRefreshWithPromise(btnRefreshForWorkouts,
            function() {
                changeDisableStatusToWorkoutsFinderInstruments(true);
                showLoadingInWorkoutsTable();
            }, async function() {
                let cbWorkoutTypesForWorkouts = document.getElementById(_CB_WORKOUT_TYPES_FOR_WORKOUTS_ID);
                if (cbWorkoutTypesForWorkouts) {
                    let firstOption = document.createElement("option");
                    firstOption.textContent = "Все";

                    await _WORKOUT_TYPE_UTILS.CB_WORKOUT_TYPES.fill(cbWorkoutTypesForWorkouts, firstOption);
                }
            }, function() {
                startToFindWorkouts();
                changeDisableStatusToWorkoutsFinderInstruments(false);
            }, _CUSTOM_TIMER_FOR_WORKOUTS_REFRESH);
    }
}

function changeDisableStatusToWorkoutsFinderInstruments(isDisable) {
    let btnRefreshForWorkouts = document.getElementById(_BTN_REFRESH_FOR_WORKOUTS_ID);
    if (btnRefreshForWorkouts) {
        btnRefreshForWorkouts.disabled = isDisable;
    }

    let cbWorkoutTypesForWorkouts = document.getElementById(_CB_WORKOUT_TYPES_FOR_WORKOUTS_ID);
    if (cbWorkoutTypesForWorkouts) {
        cbWorkoutTypesForWorkouts.disabled = isDisable;
    }
}

// Поиск статистики ---
function showLoadingInStatistic() {
    let divStatistics = document.getElementById(_DIV_STATISTIC_ID);
    if (divStatistics) {
        divStatistics.replaceChildren();
        divStatistics.className = "";
        divStatistics.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divStatistics.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divStatistics.classList.add(_DIV_STATISTIC_CONTAINER_STYLE_ID);

        divStatistics.appendChild(new LoadingElement().createDiv());
    }
}

function prepareStatisticFinder() {
    _CUSTOM_TIMER_STATISTIC_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_STATISTIC_FINDER.setHandler(async function() {
        await tryToFillStatistic();
    })
}

function startToFindStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;
    if (currentFinder) {
        currentFinder.stop();
    }

    showLoadingInStatistic();

    if (currentFinder) {
        currentFinder.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    if (_currentCustomer) {
        let workoutTypeCode;
        let cbWorkoutTypesForStatistic = document.getElementById(_CB_WORKOUT_TYPES_FOR_STATISTIC_ID);
        if (cbWorkoutTypesForStatistic) {
            workoutTypeCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbWorkoutTypesForStatistic);
        }

        let days;
        let cbPeriodsForStatistic = document.getElementById(_CB_PERIODS_FOR_STATISTIC_ID);
        if (cbPeriodsForStatistic) {
            days = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbPeriodsForStatistic);
        }

        let JSONResponse = await _WORKOUTS_API.GET.findCustomerExtraStatistic(_currentCustomer.id, workoutTypeCode, days);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let workoutsCustomerExtraStatistic =
                new WorkoutsCustomerExtraStatisticResponseDTO(JSONResponse.json);
            let divStatistic = document.getElementById(_DIV_STATISTIC_ID);
            if (divStatistic && currentFinder.getActive() === true) {
                divStatistic.replaceChildren();
                divStatistic.className = "";
                if (currentFinder.getActive() === true) {
                    divStatistic.appendChild(workoutsCustomerExtraStatistic.createTable());

                    let workoutAnswersStatistic = workoutsCustomerExtraStatistic.workoutAnswersStatistic;
                    if (workoutAnswersStatistic) {
                        divStatistic.appendChild(workoutAnswersStatistic.createTable());
                    }

                    let favouritesTable = workoutsCustomerExtraStatistic.createFavouritesTable();
                    if (favouritesTable) {
                        divStatistic.appendChild(favouritesTable);
                    }
                }
            }
        } else {
            showMessageInStatistic(new CustomResponseMessage(JSONResponse.json).text);
        }
    } else {
        showMessageInStatistic("Не удалось получить ID пользователя.");
    }
}

function showMessageInStatistic(message) {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    let divStatistic = document.getElementById(_DIV_STATISTIC_ID);
    if (divStatistic) {
        let divMessage = document.createElement("div");
        divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        divMessage.textContent = message;

        if (currentFinder.getActive() === true) {
            divStatistic.replaceChildren();
            if (currentFinder.getActive() === true) {
                divStatistic.appendChild(divMessage);
            }
        }
    }
}
//---

// Поиск истории тренировок ---
function showLoadingInWorkoutsTable() {
    // Отображаем загрузку в таблице ---
    let tHead = document.getElementById(_THEAD_WORKOUTS_ID);
    let tBody = document.getElementById(_TBODY_WORKOUTS_ID);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBody.replaceChildren();
        tBody.appendChild(trMessage);
    }
    //---
}

function prepareWorkoutsFinder() {
    _CUSTOM_TIMER_WORKOUTS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORKOUTS_FINDER.setHandler(async function() {
        if (_currentCustomer) {
            // Ищем максимальную дату окончания ---
            let customerId = _currentCustomer.id;

            let workoutTypeCode;
            let cbWorkoutTypesForWorkouts = document.getElementById(_CB_WORKOUT_TYPES_FOR_WORKOUTS_ID);
            if (cbWorkoutTypesForWorkouts) {
                workoutTypeCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbWorkoutTypesForWorkouts);
            }

            // Находим максимальную дату окончания тренировки ---
            let JSONResponse = await _WORKOUTS_API.GET.findMaxDateOfEnd(customerId, workoutTypeCode);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _dateOfEnd = new DateResponse(JSONResponse.json).date;
            }
            //---

            await tryToFillWorkoutsTable(true, true);
        } else {
            setMessageInsideWorkoutsTable("Не удалось получить ID пользователя.");
        }
    });
}

function startToFindWorkouts() {
    let currentFinder = _CUSTOM_TIMER_WORKOUTS_FINDER;
    if (currentFinder) {
        currentFinder.stop();
    }

    showLoadingInWorkoutsTable();

    if (currentFinder) {
        currentFinder.start();
    }
}

async function tryToFillWorkoutsTable(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORKOUTS_FINDER;

    let customerId = _currentCustomer.id;

    let workoutTypeCode;
    let cbWorkoutTypesForWorkouts = document.getElementById(_CB_WORKOUT_TYPES_FOR_WORKOUTS_ID);
    if (cbWorkoutTypesForWorkouts) {
        workoutTypeCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbWorkoutTypesForWorkouts);
    }

    let JSONResponse = await _WORKOUTS_API.GET.getAllFiltered(customerId, workoutTypeCode, _dateOfEnd);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createWorkoutsTableRows(JSONResponse.json, customerId, workoutTypeCode);

        let tBody = document.getElementById(_TBODY_WORKOUTS_ID);
        if (tableRows && tBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tBody.replaceChildren();
            }

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tBody.appendChild(tableRows[i]);
            }
        }
    } else {
        if (doNeedToShowTableMessage === true) {
            let message = new CustomResponseMessage(JSONResponse.json).text;
            setMessageInsideWorkoutsTable(message);
        }
    }
}

async function createWorkoutsTableRows(workoutsJson, customerId, workoutTypeCode) {
    let currentFinder = _CUSTOM_TIMER_WORKOUTS_FINDER;
    let tableRows = [];

    // Создаём строку с датой ---
    let tHead = document.getElementById(_THEAD_WORKOUTS_ID);
    if (tHead) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trDate = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns,
            new DateParts(_dateOfEnd).getDateStr());
        trDate.style.fontWeight = "bold";

        tableRows.push(trDate);
    }
    //---

    for (let i = 0; i < workoutsJson.length; i++) {
        let workout = new WorkoutResponseDTO(workoutsJson[i]);

        let row = createWorkoutTableRow(workout, i);
        if (row) {
            tableRows.push(row);
        }
    }

    // Создаём кнопку "Показать больше" на основе следующей даты ---
    if (currentFinder.getActive() === true) {
        let JSONResponse = await _WORKOUTS_API.GET.findNextDateOfEnd(customerId, workoutTypeCode, _dateOfEnd);
        if (JSONResponse.status === _HTTP_STATUSES.OK && currentFinder.getActive() === true) {
            _dateOfEnd = new DateResponse(JSONResponse.json).date;

            if (tHead) {
                let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
                let message = `Показать тренировки за ${new DateParts(_dateOfEnd).getDateStr()}`;
                let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns, message, async function() {
                    await tryToFillWorkoutsTable(false, false);
                });

                tableRows.push(trShowMore);
            }
        }
    }
    //---

    return tableRows;
}

function createWorkoutTableRow(workout, index) {
    let tr = document.createElement("tr");

    // Порядковый номер ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${index + 1}.`;

    tr.appendChild(td);
    //---

    // Тренировка ---
    td = document.createElement("td");
    td.appendChild(workout.createDivInfo());

    tr.appendChild(td);
    //---

    // Затраченное время ---
    td = document.createElement("td");
    td.style.textAlign = "center";
    td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
    td.style.fontWeight = "bold";
    td.textContent = new TimeParts(workout.currentMilliseconds).getTimeStr(
        false, true, true, false);

    tr.appendChild(td);
    //---

    // Действия ---
    let divActions = document.createElement("div");
    divActions.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

    let aBtnInfo = _A_BUTTONS.A_BUTTON_INFO.createA(_A_BUTTON_IMG_SIZES.SIZE_32);
    aBtnInfo.addEventListener("click", function() {
        let urlStr = `${_RESOURCE_URLS.WORKOUTS_INFO}/${workout.id}`;
        window.open(urlStr, workout.id);
    });
    divActions.appendChild(aBtnInfo);

    td = document.createElement("td");
    td.appendChild(divActions);

    tr.appendChild(td);
    //---

    return tr;
}

function setMessageInsideWorkoutsTable(message) {
    let currentFinder = _CUSTOM_TIMER_WORKOUTS_FINDER;

    let tHead = document.getElementById(_THEAD_WORKOUTS_ID);
    let tBody = document.getElementById(_TBODY_WORKOUTS_ID);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tBody.appendChild(trMessage);
            }
        }
    }
}
//---