import {
    CustomerResponseDTO
} from "./customer.js";

import {
    WorkoutTypeResponseDTO
} from "./workout_type/workout_type.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    CustomerCollectionResponseDTO
} from "./customer_collection.js";

import {
    DateParts
} from "../../date_parts.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

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
        div.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_CONTAINER_STYLE_ID);
        //---

        // Создаём левый контейнер с изображением ---
        let imgWorkoutType = document.createElement("img");
        imgWorkoutType.classList.add(_CSS_DYNAMIC_INFO_BLOCK.IMG_IMG_DYNAMIC_INFO_BLOCK_STYLE_ID);
        imgWorkoutType.src = this.workoutType.pathToImage;

        let leftDiv = document.createElement("div");
        leftDiv.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_LEFT_CONTAINER_STYLE_ID);
        leftDiv.appendChild(imgWorkoutType);

        div.appendChild(leftDiv);
        //---

        // Создаём правый контейнер с данными ---
        let divRightContainer = document.createElement("div");
        divRightContainer.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_RIGHT_CONTAINER);
        //---

        // Заголовок ---
        let h1WorkoutType = document.createElement("h1");
        h1WorkoutType.classList.add(_CSS_DYNAMIC_INFO_BLOCK.H1_H1_DYNAMIC_INFO_BLOCK_STYLE_ID);
        h1WorkoutType.textContent = this.workoutType.title;

        divRightContainer.appendChild(h1WorkoutType);
        //---

        // Id тренировки ---
        let divDataRow = document.createElement("div");
        divDataRow.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

        let spanInfoAboutData = document.createElement("span");
        spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
        spanInfoAboutData.textContent = "ID:";
        divDataRow.appendChild(spanInfoAboutData);

        let spanData = document.createElement("span");
        spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);
        spanData.textContent = this.id;
        divDataRow.appendChild(spanData);

        divRightContainer.appendChild(divDataRow);
        //---

        // Дата начала ---
        let dateOfStartObj = new Date(this.dateOfStart);

        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Дата начала:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);
        spanData.textContent = new DateParts(dateOfStartObj).getDateWithTimeStr();
        divDataRow.appendChild(spanData);

        divRightContainer.appendChild(divDataRow);
        //--

        // Дата окончания (при наличии) ---
        if (this.dateOfEnd) {
            let dateOfEndObj = new Date(this.dateOfEnd);

            divDataRow = divDataRow.cloneNode(false);

            spanInfoAboutData = spanInfoAboutData.cloneNode(false);
            spanInfoAboutData.textContent = "Дата окончания:";
            divDataRow.appendChild(spanInfoAboutData);

            spanData = spanData.cloneNode(false);
            spanData.textContent = new DateParts(dateOfEndObj).getDateWithTimeStr();
            divDataRow.appendChild(spanData);

            divRightContainer.appendChild(divDataRow);
        }
        //---

        // Начальный язык ---
        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Начальный язык:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);
        spanData.appendChild(this.langIn.createSpan());
        divDataRow.appendChild(spanData);

        divRightContainer.appendChild(divDataRow);
        //---

        // Конечный язык ---
        divDataRow = divDataRow.cloneNode(false);

        spanInfoAboutData = spanInfoAboutData.cloneNode(false);
        spanInfoAboutData.textContent = "Конечный язык:";
        divDataRow.appendChild(spanInfoAboutData);

        spanData = spanData.cloneNode(false);
        spanData.appendChild(this.langOut.createSpan());
        divDataRow.appendChild(spanData);

        divRightContainer.appendChild(divDataRow);
        //---

        // Коллекция (при наличии)
        let collection = this.customerCollection;
        if (collection) {
            divDataRow = divDataRow.cloneNode(false);

            spanInfoAboutData = spanInfoAboutData.cloneNode(false);
            spanInfoAboutData.textContent = "Коллекция:";
            divDataRow.appendChild(spanInfoAboutData);

            spanData = spanData.cloneNode(false);
            spanData.appendChild(collection.createSpan());
            divDataRow.appendChild(spanData);

            divRightContainer.appendChild(divDataRow);
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