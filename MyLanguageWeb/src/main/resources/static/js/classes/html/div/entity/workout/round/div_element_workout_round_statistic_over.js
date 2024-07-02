import {
    DivAbstractElement
} from "../../../abstracts/div_abstract_element.js";

import {
    WorkoutsAPI
} from "../../../../../api/entity/workouts_api.js"

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    CssInfoBlockHeader
} from "../../../../../css/info_block/css_info_block_header.js";

import {
    TableElementWorkoutAnswersStatistic
} from "../../../../table/entity/workout/statistic/answers/table_element_workout_answers_statistic.js";

import {
    ImgSrcs
} from "../../../../img_srcs.js";

import {
    WorkoutRoundStatisticResponseDTO
} from "../../../../../dto/entity/workout/types/statistic/workout_round_statistic_response_dto.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_INFO_BLOCK_HEADER = new CssInfoBlockHeader();

const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();

export class DivElementWorkoutRoundStatisticOver extends DivAbstractElement {
    #workoutId;
    #roundNumber;

    constructor(div) {
        super(div);
    }

    setWorkoutId(workoutId) {
        this.#workoutId = workoutId;
    }

    setRoundNumber(roundNumber) {
        this.#roundNumber = roundNumber;
    }


    async tryToCreateContent() {
        let div;

        // Получаем данные для поиска ---
        let workoutId = this.#workoutId;
        let roundNumber = this.#roundNumber;
        //---

        let jsonResponse = await _WORKOUTS_API.GET.findRoundStatistic(workoutId, roundNumber);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let workoutRoundStatisticResponseDTO = new WorkoutRoundStatisticResponseDTO(
                jsonResponse.getJson());

            div = document.createElement("div");
            div.style.display = "grid"
            div.style.grid = "1fr / 1fr 1fr";
            div.style.gap = "5px";

            // Номер раунда ---
            let divRoundNumber = document.createElement("div");
            divRoundNumber.classList.add(_CSS_INFO_BLOCK_HEADER.DIV_INFO_BLOCK_HEADER_CONTAINER_CLASS_ID);

            let img = document.createElement("img");
            img.src = _IMG_SRCS.OTHER.FLAME;
            divRoundNumber.appendChild(img);

            let h1 = document.createElement("h1");
            h1.textContent = `Раунд №${roundNumber}`;
            divRoundNumber.appendChild(h1);

            div.appendChild(divRoundNumber);
            //---

            // Статистика раунда ---
            let tableElementWorkoutAnswersStatistic = new TableElementWorkoutAnswersStatistic(
                null, null, null, null);
            tableElementWorkoutAnswersStatistic.setWorkoutAnswersStatisticResponseDTO(
                workoutRoundStatisticResponseDTO.getWorkoutAnswersStatistic());
            tableElementWorkoutAnswersStatistic.buildNewTable();

            await tableElementWorkoutAnswersStatistic.prepare();
            await tableElementWorkoutAnswersStatistic.fill();

            let table = tableElementWorkoutAnswersStatistic.getTable();
            if (table) {
                div.appendChild(table);
            }
            //---
        } else {
            this.showMessage(new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage(),
                _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }
}