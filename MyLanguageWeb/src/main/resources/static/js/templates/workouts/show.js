import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WorkoutTypeResponseDTO
} from "../../classes/dto/entity/workout_type/workout_type.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    WorkoutTypesAPI
} from "../../classes/api/workout_types_api.js";

import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    ImageSources
} from "../../classes/image_sources.js";

import {
    ResourceUrls
} from "../../classes/resource_urls.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    CustomersAPI
} from "../../classes/api/customers_api.js";

import {
    CustomerResponseDTO
} from "../../classes/dto/entity/customer.js";

import {
    CustomerRoles
} from "../../classes/dto/entity/customer_role/customer_roles.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();
const _CUSTOMERS_API = new CustomersAPI();

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _IMAGE_SOURCES = new ImageSources();
const _RESOURCE_URLS = new ResourceUrls()
const _GLOBAL_COOKIES = new GlobalCookies();
const _CUSTOMER_ROLES = new CustomerRoles();

const _DIV_WORKOUT_TYPE_ACTION_STYLE_ID = "workout-type-action";
const _IMG_IMG_WORKOUT_TYPE_ACTION_STYLE_ID = "img-workout-type-action";

const _DIV_WORKOUT_TYPES_CONTAINER_ID = "workout_types_container";

const _CUSTOM_TIMER_WORKOUT_TYPES_FINDER = new CustomTimer();

window.onload = async function () {
    // Подготавливаем таймеры ---
    prepareWorkoutTypesFinder();
    //---

    // Запускаем таймеры ---
    startToFindWorkoutTypes();
    //---
}

// Поиск режимов тренировок ---
function prepareWorkoutTypesFinder() {
    _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.setTimeout(250);
    _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.setHandler(async function() {
        await tryToFillWorkoutTypes();
    });
}

function startToFindWorkoutTypes() {
    if (_CUSTOM_TIMER_WORKOUT_TYPES_FINDER) {
        _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.stop();
    }

    let divWorkoutTypesContainer = document.getElementById(_DIV_WORKOUT_TYPES_CONTAINER_ID);
    if (divWorkoutTypesContainer) {
        divWorkoutTypesContainer.className = "";
        divWorkoutTypesContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divWorkoutTypesContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
        divWorkoutTypesContainer.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_WORKOUT_TYPES_FINDER) {
        _CUSTOM_TIMER_WORKOUT_TYPES_FINDER.start();
    }
}

async function tryToFillWorkoutTypes() {
    let divWorkoutTypesContainer = document.getElementById(_DIV_WORKOUT_TYPES_CONTAINER_ID);
    if (divWorkoutTypesContainer) {
        let JSONResponse = await _WORKOUT_TYPES_API.GET.getAll();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let divWorkoutTypes = await createDivWorkoutTypes(JSONResponse.json);

            divWorkoutTypesContainer.replaceChildren();
            divWorkoutTypesContainer.className = "";
            divWorkoutTypesContainer.appendChild(divWorkoutTypes);
        } else {
            let divMessage = document.createElement("div");
            divMessage.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
            divMessage.textContent = new CustomResponseMessage(JSONResponse.json).text;

            divWorkoutTypesContainer.replaceChildren();
            divWorkoutTypesContainer.className = "";
            divWorkoutTypesContainer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
            divWorkoutTypesContainer.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);
            divWorkoutTypesContainer.appendChild(divMessage);
        }
    }
}

async function createDivWorkoutTypes(workoutTypesJson) {
    // Высчитываем количество колонок и строк ---
    let numberOfColumns = 3;
    let numberOfRows = Math.ceil(workoutTypesJson.length / numberOfColumns);

    let gridTemplateColumnsStr = "1fr";
    for (let i = 0; i < numberOfColumns - 1; i++) {
        gridTemplateColumnsStr += " 1fr";
    }

    let gridTemplateRowsStr = "1fr";
    for (let i = 0; i < numberOfRows - 1; i++) {
        gridTemplateRowsStr += " 1fr";
    }
    //---

    // Ищем пользователя, чтобы определить его роль ---
    let customerId = _GLOBAL_COOKIES.AUTH_ID.getValue();

    let customer;
    let JSONResponse = await _CUSTOMERS_API.GET.findById(customerId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        customer = new CustomerResponseDTO(JSONResponse.json);
    }
    //---

    // Создаём контейнер ---
    let divWorkoutTypes = document.createElement("div");
    divWorkoutTypes.style.display = "grid";
    divWorkoutTypes.style.gridAutoFlow = "row";
    divWorkoutTypes.style.gridTemplateColumns = gridTemplateColumnsStr;
    divWorkoutTypes.style.gridTemplateRows = gridTemplateRowsStr;
    divWorkoutTypes.style.gap = "20px";
    //---

    for (let i = 0; i < numberOfColumns * numberOfRows; i++) {
        let workoutType;
        if (i < workoutTypesJson.length) {
            workoutType = new WorkoutTypeResponseDTO(workoutTypesJson[i]);
        }

        // Создаём контейнер для будущей кнопки ---
        let divAction = document.createElement("div");
        divAction.classList.add(_CSS_MAIN.DIV_VERTICAL_FLEX_CONTAINER_STANDARD_STYLE_ID);
        divAction.classList.add(_DIV_WORKOUT_TYPE_ACTION_STYLE_ID);
        //---

        // Изображение ---
        let imgWorkoutTypeImage = document.createElement("img");
        imgWorkoutTypeImage.classList.add(_IMG_IMG_WORKOUT_TYPE_ACTION_STYLE_ID);

        let pathToImage;
        if (workoutType) {
            pathToImage = workoutType.pathToImage;
        }

        if (!pathToImage) {
            pathToImage = _IMAGE_SOURCES.WORKOUTS.BRAIN;
        }

        imgWorkoutTypeImage.src = pathToImage;
        divAction.appendChild(imgWorkoutTypeImage);
        //---

        // Название ---
        let divWorkoutTypeTitle = document.createElement("div");

        let title;
        if (workoutType) {
            title = workoutType.title
        }

        if (!title) {
            title = "...";
        }

        divWorkoutTypeTitle.textContent = title;
        divAction.appendChild(divWorkoutTypeTitle);
        //---

        // Создаём кнопку ---
        let isActive;
        if (workoutType) {
            if (customer &&
                (customer.role.id === _CUSTOMER_ROLES.ADMIN.ID
                    || customer.role.id === _CUSTOMER_ROLES.MODERATOR.ID)) {
                isActive = true;
            } else {
                isActive = workoutType.isActive;
            }
        }

        if (!isActive) {
            isActive = false;
        }

        let aBtnAction = document.createElement("a");
        aBtnAction.classList.add(isActive === true
            ? _CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID
            : _CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);

        if (workoutType) {
            aBtnAction.title = workoutType.message;
            aBtnAction.href = `${_RESOURCE_URLS.WORKOUTS}/${workoutType.code}`;
        }

        aBtnAction.appendChild(divAction);
        //---

        divWorkoutTypes.appendChild(aBtnAction);
    }

    return divWorkoutTypes;
}
//---