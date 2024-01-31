import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WorkoutTypeResponseDTO
} from "../../classes/dto/workout_type.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    CssInfoBlockWithImgAndHeader
} from "../../classes/css/css_info_block_with_img_and_header.js";

import {
    WorkoutTypesAPI
} from "../../classes/api/workout_types/workout_types_api.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _CSS_MAIN = new CssMain();
const _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER = new CssInfoBlockWithImgAndHeader();

const _A_WORKOUT_TYPES_ITEM_STYLE_ID = "workout-types-item";
const _IMG_WORKOUT_TYPES_ITEM_IMG_STYLE_ID = "workout-types-item-img";

const _DIV_WORKOUT_TYPES_CONTAINER_ID = "workout_types_container";
const _DIV_WORKOUT_TYPE_INFO_CONTAINER_ID = "workout_type_info_container";

window.onload = async function () {
    await prepareWorkoutTypesContainer();
}

async function prepareWorkoutTypesContainer() {
    let divWorkoutTypesContainer = document.getElementById(_DIV_WORKOUT_TYPES_CONTAINER_ID);
    if (divWorkoutTypesContainer) {
        let JSONResponse = await _WORKOUT_TYPES_API.GET.getAll();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let workoutTypesJson = JSONResponse.json;

            // Применяем стили контейнеру, добавляем столько колонок, сколько типов тренировок ---
            divWorkoutTypesContainer.style.display = "grid";

            let frColumns = "1fr";
            for (let j = 0; j < workoutTypesJson.length - 1; j++) {
                frColumns += " 1fr";
            }

            divWorkoutTypesContainer.style.grid = "1fr / " + frColumns;
            divWorkoutTypesContainer.style.gap = "20px";
            //---

            for (let i = 0; i < workoutTypesJson.length; i++) {
                let workoutType = new WorkoutTypeResponseDTO(workoutTypesJson[i]);

                // Изображение ---
                let imgWorkoutTypeImage = document.createElement("img");
                imgWorkoutTypeImage.classList.add(_IMG_WORKOUT_TYPES_ITEM_IMG_STYLE_ID);
                imgWorkoutTypeImage.src = workoutType.pathToImage;
                //---

                // Название ---
                let divWorkoutTypeTitle = document.createElement("div");
                divWorkoutTypeTitle.textContent = workoutType.title;
                if (workoutType.isActive === false) {
                    divWorkoutTypeTitle.textContent += " (Скоро)";
                }
                //---

                // Создаём кнопку ---
                let aWorkoutType = document.createElement("a");
                aWorkoutType.classList.add(_A_WORKOUT_TYPES_ITEM_STYLE_ID);

                if (workoutType.isActive === true) {
                    aWorkoutType.classList.add(_CSS_MAIN.A_BUTTON_STANDARD_STYLE_ID);
                    aWorkoutType.href = "/workouts/" + workoutType.code;
                } else {
                    aWorkoutType.classList.add(_CSS_MAIN.A_BUTTON_DISABLED_STANDARD_STYLE_ID);
                    aWorkoutType.style.pointerEvents = "auto";
                    aWorkoutType.style.cursor = "pointer";
                }

                aWorkoutType.addEventListener("mouseover", function () {
                    showWorkoutTypeInfo(workoutType);
                });

                aWorkoutType.addEventListener("mouseout", function () {
                    let divWorkoutTypeInfoContainer =
                        document.getElementById(_DIV_WORKOUT_TYPE_INFO_CONTAINER_ID);
                    if (divWorkoutTypeInfoContainer) {
                        divWorkoutTypeInfoContainer.replaceChildren();
                    }
                });

                aWorkoutType.append(imgWorkoutTypeImage);
                aWorkoutType.append(divWorkoutTypeTitle);
                //---

                // Добавляем кнопку в контейнер ---
                divWorkoutTypesContainer.appendChild(aWorkoutType);
                //---
            }
        }
    }
}

function showWorkoutTypeInfo(workoutTypeObj) {
    let divWorkoutTypeInfoContainer = document.getElementById(_DIV_WORKOUT_TYPE_INFO_CONTAINER_ID);
    if (divWorkoutTypeInfoContainer) {
        // Изображение ---
        let imgWorkoutType = document.createElement("img");
        imgWorkoutType.classList.add(_CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.IMG_INFO_BLOCK_WITH_IMG_AND_HEADER_STYLE_ID);
        imgWorkoutType.src = workoutTypeObj.pathToImage;
        //---

        // Левый контейнер ---
        let divWorkoutTypeInfoLeftContainer = document.createElement("div");
        divWorkoutTypeInfoLeftContainer.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_LEFT_CONTAINER_STYLE_ID);
        divWorkoutTypeInfoLeftContainer.appendChild(imgWorkoutType);
        //---

        // Название ---
        let h1WorkoutTypeTitle = document.createElement("h1");
        h1WorkoutTypeTitle.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.H1_INFO_BLOCK_WITH_IMG_AND_HEADER_STYLE_ID);
        h1WorkoutTypeTitle.textContent = workoutTypeObj.title;
        if (workoutTypeObj.isActive === false) {
            h1WorkoutTypeTitle.textContent += " (Скоро)";
        }
        //---

        // Описание ---
        let divWorkoutTypeMessage = document.createElement("div");
        divWorkoutTypeMessage.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_TEXT_STYLE_ID);
        divWorkoutTypeMessage.textContent = workoutTypeObj.message;
        //---

        // Правый контейнер ---
        let divWorkoutTypeInfoRightContainer = document.createElement("div");
        divWorkoutTypeInfoRightContainer.classList.add(
            _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_RIGHT_CONTAINER_STYLE_ID);
        divWorkoutTypeInfoRightContainer.appendChild(h1WorkoutTypeTitle);
        divWorkoutTypeInfoRightContainer.appendChild(divWorkoutTypeMessage);
        //---

        // Генерируем итоговый контейнер ---
        const DIV_WORKOUT_INFO_ID = "workout_type_info";

        let divWorkoutTypeInfo = document.getElementById(DIV_WORKOUT_INFO_ID);
        if (divWorkoutTypeInfo) {
            divWorkoutTypeInfo.replaceChildren();
        } else {
            divWorkoutTypeInfo = document.createElement("div");
            divWorkoutTypeInfo.id = DIV_WORKOUT_INFO_ID;
            divWorkoutTypeInfo.classList.add(
                _CSS_INFO_BLOCK_WITH_IMG_AND_HEADER.DIV_INFO_BLOCK_WITH_IMG_AND_HEADER_CONTAINER_STYLE_ID);
            divWorkoutTypeInfoContainer.appendChild(divWorkoutTypeInfo);
        }

        divWorkoutTypeInfo.appendChild(divWorkoutTypeInfoLeftContainer);
        divWorkoutTypeInfo.appendChild(divWorkoutTypeInfoRightContainer);
        //---
    }
}