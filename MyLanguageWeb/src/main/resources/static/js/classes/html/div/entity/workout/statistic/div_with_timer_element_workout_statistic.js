import {
    DivWithTimerAbstractElement
} from "../../../with_timer/abstracts/div_with_timer_abstract_element.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    WorkoutsAPI
} from "../../../../../api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    WorkoutStatisticResponseDTO
} from "../../../../../dto/entity/workout/types/statistic/workout_statistic_response_dto.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    TableElementWorkoutStatistic
} from "../../../../table/entity/workout/statistic/table_element_workout_statistic.js";

import {
    TableElementWorkoutAnswersStatistic
} from "../../../../table/entity/workout/statistic/answers/table_element_workout_answers_statistic.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class DivWithTimerElementWorkoutStatistic extends DivWithTimerAbstractElement {
    #workoutResponseDTO;

    constructor(div) {
        super(div);
    }

    setWorkoutResponseDTO(workoutResponseDTOObj) {
        this.#workoutResponseDTO = workoutResponseDTOObj;
    }


    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let workoutResponseDTO = this.#workoutResponseDTO;
        if (!workoutResponseDTO) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Не удалось получить данные о тренировке");
        }

        return isCorrect;
    }

    showLoading() {
        super.showLoading();

        this.addInfoBlockContainerClassStyle();
    }

    async tryToCreateContent() {
        let div;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateContent();
        if (isCorrect) {
            let workoutResponseDTO = this.#workoutResponseDTO;
            if (workoutResponseDTO) {
                let jsonResponse = await _WORKOUTS_API.GET.findStatistic(workoutResponseDTO.getId());
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let workoutStatisticResponseDTO =
                        new WorkoutStatisticResponseDTO(jsonResponse.getJson());

                    div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.flexDirection = "column";
                    div.style.gap = "5px";

                    // Основная статистика по тренировке ---
                    let tableElementWorkoutStatistic = new TableElementWorkoutStatistic(
                        null, null, null, null);
                    tableElementWorkoutStatistic.setWorkoutStatisticResponseDTO(workoutStatisticResponseDTO);
                    tableElementWorkoutStatistic.buildNewTable();

                    await tableElementWorkoutStatistic.prepare();
                    await tableElementWorkoutStatistic.fill();

                    let table = tableElementWorkoutStatistic.getTable();
                    if (table) {
                        div.appendChild(table);
                    }
                    //---

                    // Статистика ответов по тренировке ---
                    let tableElementWorkoutAnswersStatistic =
                        new TableElementWorkoutAnswersStatistic(null, null, null, null);
                    tableElementWorkoutAnswersStatistic.setWorkoutAnswersStatisticResponseDTO(
                        workoutStatisticResponseDTO.getWorkoutAnswersStatistic());
                    tableElementWorkoutAnswersStatistic.buildNewTable();

                    await tableElementWorkoutAnswersStatistic.prepare();
                    await tableElementWorkoutAnswersStatistic.fill();

                    table = tableElementWorkoutAnswersStatistic.getTable();
                    if (table) {
                        div.appendChild(table);
                    }
                    //---

                    this.removeInfoBlockContainerClassStyle();
                } else {
                    this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                        _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
                }
            }
        }

        return div;
    }
}