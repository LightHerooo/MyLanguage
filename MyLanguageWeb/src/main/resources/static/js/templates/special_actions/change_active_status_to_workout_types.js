import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    WorkoutTypesAPI
} from "../../classes/api/workout_types_api.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    WorkoutTypeRequestDTO,
    WorkoutTypeResponseDTO
} from "../../classes/dto/entity/workout_type/workout_type.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    ImageSources
} from "../../classes/image_sources.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _TEXT_BOX_UTILS = new TextBoxUtils();
const _TABLE_UTILS = new TableUtils();
const _HTTP_STATUSES = new HttpStatuses();
const _IMAGE_SOURCES = new ImageSources();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

const _TB_FINDER_ID = "tb_finder";
const _BTN_REFRESH_ID = "btn_refresh";

const _THEAD_WORKOUT_TYPES_ID = "thead_workout_types";
const _TBODY_WORKOUT_TYPES_ID = "tbody_workout_types";

const _CUSTOM_TIMER_WORKOUT_TYPES_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

const _CUSTOM_TIMER_FOR_TB_FINDER = new CustomTimer();

window.onload = async function() {
    // Подготавливаем таймеры ---
    prepareWorkoutTypesFinder();
    //---

    prepareTbFinder();
    prepareBtnRefresh();

    // Запускаем таймеры ---
    startToFindWorkoutTypes();
    //---
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startToFindWorkoutTypes, _CUSTOM_TIMER_FOR_TB_FINDER);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", function () {
            startToFindWorkoutTypes();
        });
    }
}

// Поиск режимов тренировок ---
function prepareWorkoutTypesFinder() {
    _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.setHandler(async function() {
        await tryToFillWorkoutTypesTable();
    })
}

function startToFindWorkoutTypes() {
    if (_CUSTOM_TIMER_WORKOUT_TYPES_FINDER) {
        _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.stop();
    }

    // Показываем загрузку ---
    let tHead = document.getElementById(_THEAD_WORKOUT_TYPES_ID);
    let tBody = document.getElementById(_TBODY_WORKOUT_TYPES_ID);
    if (tHead && tBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tHead);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tBody.replaceChildren();
        tBody.appendChild(trLoading);
    }
    //---

    if (_CUSTOM_TIMER_WORKOUT_TYPES_FINDER) {
        _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.start();
    }
}

async function tryToFillWorkoutTypesTable() {
    let currentFinder = _CUSTOM_TIMER_WORKOUT_TYPES_FINDER;

    let title;
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        title = tbFinder.value.trim();
    }

    let JSONResponse = await _WORKOUT_TYPES_API.GET.getAllFiltered(title);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = createWorkoutTypesTableRows(JSONResponse.json);

        let tBody = document.getElementById(_TBODY_WORKOUT_TYPES_ID);
        if (tBody && currentFinder.getActive() === true) {
            tBody.replaceChildren();

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tBody.appendChild(tableRows[i]);
            }
        }
    } else {
        let message = new CustomResponseMessage(JSONResponse.json).text;

        let tHead = document.getElementById(_THEAD_WORKOUT_TYPES_ID);
        let tBody = document.getElementById(_TBODY_WORKOUT_TYPES_ID);
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
}

function createWorkoutTypesTableRows(workoutTypesJson) {
    let tableRows = [];

    for (let i = 0; i < workoutTypesJson.length; i++) {
        let workoutType = new WorkoutTypeResponseDTO(workoutTypesJson[i]);

        let row = createWorkoutTypesTableRow(workoutType, i + 1);
        if (row) {
            tableRows.push(row);
        }
    }

    return tableRows;
}

function createWorkoutTypesTableRow(workoutType, index) {
    const ROW_HEIGHT = "90px";

    let row = document.createElement("tr");
    row.style.height = ROW_HEIGHT;

    // Номер строки ---
    let td = document.createElement("td");
    td.style.textAlign = "center";
    td.textContent = `${index}.`;
    row.appendChild(td);
    //---

    // Название ---
    let divWorkoutContainer = document.createElement("div");
    divWorkoutContainer.style.display = "flex";
    divWorkoutContainer.style.flexDirection = "row";
    divWorkoutContainer.style.alignItems = "center";
    divWorkoutContainer.style.gap = "10px";

    let imgWorkout = document.createElement("img");
    imgWorkout.style.width = "64px";
    imgWorkout.style.height = "64px";

    let pathToImage = workoutType.pathToImage;
    if (!pathToImage) {
        pathToImage = _IMAGE_SOURCES.WORKOUTS.BRAIN;
    }
    imgWorkout.src = pathToImage;
    divWorkoutContainer.appendChild(imgWorkout);

    let spanTitle = document.createElement("span");
    spanTitle.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
    spanTitle.style.fontWeight = "bold";
    spanTitle.textContent = workoutType.title;
    divWorkoutContainer.appendChild(spanTitle);

    td = document.createElement("td");
    td.appendChild(divWorkoutContainer);

    row.appendChild(td);
    //---

    // Статус активности ---
    let cbActive = document.createElement("select");
    cbActive.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
    cbActive.style.height = ROW_HEIGHT;
    cbActive.style.width = "100%";

    _COMBO_BOX_UTILS.prepareCbBoolean(cbActive);

    _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(cbActive,
        workoutType.isActive === true ? 0 : 1, true);

    cbActive.addEventListener("change", async function() {
        this.disabled = true;

        let isActive = this.selectedIndex === 0;

        let workoutTypeRequestDTO = new WorkoutTypeRequestDTO();
        workoutTypeRequestDTO.code = workoutType.code;
        workoutTypeRequestDTO.isActive = isActive;

        let JSONResponse = await _WORKOUT_TYPES_API.PATCH.changeActiveStatus(workoutTypeRequestDTO);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            this.disabled = false;
        }
    });

    td = document.createElement("td");
    td.style.padding = "1px";
    td.appendChild(cbActive);

    row.appendChild(td);
    //---

    return row;
}
//---


