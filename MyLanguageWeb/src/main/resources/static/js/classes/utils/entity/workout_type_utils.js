import {
    WorkoutTypesAPI
} from "../../api/workout_types_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WorkoutTypeResponseDTO
} from "../../dto/entity/workout_type/workout_type.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

export class WorkoutTypeUtils {
    CB_WORKOUT_TYPES = new CbWorkoutTypes();
}

class CbWorkoutTypes {
    async #fillClear(cbWorkoutTypes, firstOption) {
        if (cbWorkoutTypes) {
            cbWorkoutTypes.replaceChildren();

            if (firstOption) {
                firstOption.value = "";
                cbWorkoutTypes.appendChild(firstOption);
            }

            let JSONResponse = await _WORKOUT_TYPES_API.GET.getAllFiltered(null);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let json = JSONResponse.json;
                for (let i = 0; i < json.length; i++) {
                    let workoutType = new WorkoutTypeResponseDTO(json[i]);

                    let option = document.createElement("option");
                    option.value = workoutType.code;
                    option.textContent = workoutType.title;

                    cbWorkoutTypes.appendChild(option);
                }
            }
        }
    }

    async prepare(cbWorkoutTypes, firstOption) {
        if (cbWorkoutTypes) {
            await this.#fillClear(cbWorkoutTypes, firstOption);
        }
    }

    async fill(cbWorkoutTypes, firstOption) {
        // Запоминаем, какой элемент был выбран до очистки списка ---
        let oldWorkoutType = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_VALUE.byComboBox(cbWorkoutTypes);
        //---

        await this.#fillClear(cbWorkoutTypes, firstOption);

        // Пытаемся установить старый элемент ---
        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemValue(
            cbWorkoutTypes, oldWorkoutType, false);
        //---
    }
}