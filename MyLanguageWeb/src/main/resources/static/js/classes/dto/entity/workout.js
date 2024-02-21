import {
    CustomerResponseDTO
} from "./customer.js";

import {
    WorkoutTypeResponseDTO
} from "./workout_type.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    CustomerCollectionResponseDTO
} from "./customer_collection.js";

import {
    CssWorkoutInfo
} from "../../css/types/css_workout_info.js";

import {
    DateParts
} from "../../date_parts.js";

import {
    CssMain
} from "../../css/css_main.js";

import {
    WorkoutsAPI
} from "../../api/workouts_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CssRoot
} from "../../css/css_root.js";

const _CSS_WORKOUT_INFO = new CssWorkoutInfo();

export class WorkoutResponseDTO {
    id;
    numberOfWords;
    dateOfStart;
    dateOfEnd;
    isActive;
    dateOfChangeActivity;
    currentMilliseconds;
    customer;
    workoutType;
    langIn;
    langOut;
    customerCollection;

    constructor(workoutJson) {
        if (workoutJson) {
            this.id = workoutJson["id"];
            this.numberOfWords = workoutJson["number_of_words"];
            this.dateOfStart = workoutJson["date_of_start"];
            this.dateOfChangeActivity = workoutJson["date_of_change_activity"];
            this.dateOfEnd = workoutJson["date_of_end"];
            this.isActive = workoutJson["is_active"];
            this.currentMilliseconds = workoutJson["current_milliseconds"];

            let customer = workoutJson["customer"];
            if (customer) {
                this.customer = new CustomerResponseDTO(customer);
            }

            let workoutType = workoutJson["workout_type"];
            if (workoutType) {
                this.workoutType = new WorkoutTypeResponseDTO(workoutType);
            }

            let langIn = workoutJson["lang_in"];
            if (langIn) {
                this.langIn = new LangResponseDTO(langIn);
            }

            let langOut = workoutJson["lang_out"];
            if (langOut) {
                this.langOut = new LangResponseDTO(langOut);
            }

            let customerCollection = workoutJson["customer_collection"];
            if (customerCollection) {
                this.customerCollection = new CustomerCollectionResponseDTO(customerCollection);
            }
        }
    }

    createDivInfo() {
        // Создаём основной контейнер ---
        let div = document.createElement("div");
        div.classList.add(_CSS_WORKOUT_INFO.DIV_WORKOUT_INFO_CONTAINER_STYLE_ID);
        //---

        // Создаём левый контейнер с изображением ---
        let imgWorkoutType = document.createElement("img");
        imgWorkoutType.classList.add(_CSS_WORKOUT_INFO.IMG_IMG_WORKOUT_INFO_STYLE_ID);
        imgWorkoutType.src = this.workoutType.pathToImage;

        let leftDiv = document.createElement("div");
        leftDiv.classList.add(_CSS_WORKOUT_INFO.DIV_WORKOUT_INFO_LEFT_CONTAINER_STYLE_ID);
        leftDiv.appendChild(imgWorkoutType);

        div.appendChild(leftDiv);
        //---

        // Создаём правый контейнер с данными ---
        let divRightContainer = document.createElement("div");
        divRightContainer.classList.add(_CSS_WORKOUT_INFO.DIV_WORKOUT_INFO_RIGHT_CONTAINER_STYLE_ID);

        // Заголовок
        let h1WorkoutType = document.createElement("h1");
        h1WorkoutType.classList.add(_CSS_WORKOUT_INFO.H1_WORKOUT_INFO_HEADER_STYLE_ID);
        h1WorkoutType.textContent = this.workoutType.title;
        divRightContainer.appendChild(h1WorkoutType);

        // Id тренировки
        let divWorkoutInfoRow = document.createElement("div");
        let spanLeftText = document.createElement("span");
        spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
        spanLeftText.textContent = "ID: ";
        divWorkoutInfoRow.appendChild(spanLeftText);

        let spanRightText = document.createElement("span");
        spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
        spanRightText.textContent = this.id;
        divWorkoutInfoRow.appendChild(spanRightText);
        divRightContainer.appendChild(divWorkoutInfoRow);

        // Дата начала
        let dateOfEndObj = new Date(this.dateOfStart);
        divWorkoutInfoRow = document.createElement("div");
        spanLeftText = document.createElement("span");
        spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
        spanLeftText.textContent = "Дата начала: ";
        divWorkoutInfoRow.appendChild(spanLeftText);

        let dateParts = new DateParts(dateOfEndObj);
        spanRightText = document.createElement("span");
        spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
        spanRightText.textContent = dateParts.getDateWithTimeStr();
        divWorkoutInfoRow.appendChild(spanRightText);
        divRightContainer.appendChild(divWorkoutInfoRow);

        // Дата окончания (при наличии)
        let dateOfEnd = this.dateOfEnd;
        if (dateOfEnd) {
            divWorkoutInfoRow = document.createElement("div");
            spanLeftText = document.createElement("span");
            spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
            spanLeftText.textContent = "Дата окончания: ";
            divWorkoutInfoRow.appendChild(spanLeftText);

            dateParts = new DateParts(dateOfEnd);
            spanRightText = document.createElement("span");
            spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
            spanRightText.textContent = dateParts.getDateWithTimeStr();
            divWorkoutInfoRow.appendChild(spanRightText);
            divRightContainer.appendChild(divWorkoutInfoRow);
        }

        // Начальный язык
        divWorkoutInfoRow = document.createElement("div");
        spanLeftText = document.createElement("span");
        spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
        spanLeftText.textContent = "Начальный язык: ";
        divWorkoutInfoRow.appendChild(spanLeftText);

        spanRightText = this.langIn.createSpan();
        spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
        divWorkoutInfoRow.appendChild(spanRightText);
        divRightContainer.appendChild(divWorkoutInfoRow);

        // Конечный язык
        divWorkoutInfoRow = document.createElement("div");
        spanLeftText = document.createElement("span");
        spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
        spanLeftText.textContent = "Конечный язык: ";
        divWorkoutInfoRow.appendChild(spanLeftText);

        spanRightText = this.langOut.createSpan();
        spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
        divWorkoutInfoRow.appendChild(spanRightText);
        divRightContainer.appendChild(divWorkoutInfoRow);

        // Коллекция (при наличии)
        let collection = this.customerCollection;
        if (collection) {
            divWorkoutInfoRow = document.createElement("div");
            spanLeftText = document.createElement("span");
            spanLeftText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_LEFT_TEXT_STYLE_ID);
            spanLeftText.textContent = "Коллекция: ";
            divWorkoutInfoRow.appendChild(spanLeftText);

            spanRightText = collection.createSpan();
            spanRightText.classList.add(_CSS_WORKOUT_INFO.SPAN_WORKOUT_INFO_RIGHT_TEXT_STYLE_ID);
            divWorkoutInfoRow.appendChild(spanRightText);
            divRightContainer.appendChild(divWorkoutInfoRow);
        }

        div.appendChild(divRightContainer);
        //---

        return div;
    }
}

export class WorkoutRequestDTO {
    id;
    numberOfWords;
    workoutTypeCode;
    langInCode;
    langOutCode;
    collectionKey;
    currentMilliseconds;
}