import {
    CssMain
} from "../../../css/css_main.js";

import {
    TimeParts
} from "../../../time_parts.js";

import {
    CssRoot
} from "../../../css/css_root.js";

import {
    WorkoutAnswersStatistic
} from "./workout_answers_statistic.js";

import {
    WorkoutResponseDTO
} from "../../entity/workout.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

export class WorkoutStatisticResponseDTO {
    numberOfMilliseconds;
    numberOfRounds;
    workoutAnswersStatistic;
    workout;

    constructor(workoutStatisticJson) {
        if (workoutStatisticJson) {
            this.numberOfMilliseconds = workoutStatisticJson["number_of_milliseconds"];
            this.numberOfRounds = workoutStatisticJson["number_of_rounds"];

            let workoutAnswersStatistic = workoutStatisticJson["workout_answers_statistic"];
            if (workoutAnswersStatistic) {
                this.workoutAnswersStatistic = new WorkoutAnswersStatistic(workoutAnswersStatistic);
            }

            let workout = workoutAnswersStatistic["workout"];
            if (workout) {
                this.workout = new WorkoutResponseDTO(workout);
            }
        }
    }

    createTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "75%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
        th.textContent = "Время";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Количество раундов";
        tr.appendChild(th);

        let tHead = document.createElement("thead");
        tHead.appendChild(tr);

        table.appendChild(tHead);
        //---

        // Времени затрачено ---
        tr = document.createElement("tr");

        let td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        td.textContent = new TimeParts(this.numberOfMilliseconds)
            .getTimeStr(false, true, true, false);

        tr.appendChild(td);
        //---

        // Количество раундов ---
        td = td.cloneNode(false);
        td.textContent = this.numberOfRounds;

        tr.appendChild(td);
        //---

        // Создаём tBody ---
        let tBody = document.createElement("tbody");
        tBody.appendChild(tr);

        table.appendChild(tBody);
        //---

        return table;
    }
}