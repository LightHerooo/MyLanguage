import {
    CssWorkoutStatistic
} from "../../css/types/css_workout_statistic.js";

import {
    CssMain
} from "../../css/css_main.js";

import {
    TimeParts
} from "../../time_parts.js";

import {
    CssRoot
} from "../../css/css_root.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();
const _CSS_WORKOUT_STATISTIC = new CssWorkoutStatistic();

export class WorkoutStatisticResponseDTO {
    numberOfMilliseconds;
    numberOfRounds;
    numberOfAnswers;
    numberOfTrueAnswers;
    numberOfFalseAnswers;

    constructor(workoutStatisticJson) {
        if (workoutStatisticJson) {
            this.numberOfMilliseconds = workoutStatisticJson["number_of_milliseconds"];
            this.numberOfRounds = workoutStatisticJson["number_of_rounds"];
            this.numberOfAnswers = workoutStatisticJson["number_of_answers"];
            this.numberOfTrueAnswers = workoutStatisticJson["number_of_true_answers"];
            this.numberOfFalseAnswers = workoutStatisticJson["number_of_false_answers"];
        }
    }

    createDiv() {
        let div = document.createElement("div");
        div.classList.add(_CSS_WORKOUT_STATISTIC.DIV_WORKOUT_STATISTIC_STYLE_ID);

        // Итоговое время ---
        let divHeader = document.createElement("div");
        divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divHeader.classList.add(_CSS_WORKOUT_STATISTIC.DIV_WORKOUT_STATISTIC_ITEM_HEADER_STYLE_ID);
        divHeader.textContent = "Итоговое время";
        div.appendChild(divHeader);

        let divData = document.createElement("div");
        divData.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divData.classList.add(_CSS_WORKOUT_STATISTIC.DIV_WORKOUT_STATISTIC_ITEM_STYLE_ID);
        divData.textContent = new TimeParts(this.numberOfMilliseconds)
            .getTimeStr(false, true, true, false);
        div.appendChild(divData);
        //---

        // Количество раундов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Количество раундов";
        div.appendChild(divHeader);

        divData = divData.cloneNode(false);
        divData.textContent = this.numberOfRounds;
        div.appendChild(divData);
        //---

        // Количество ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Количество ответов";
        div.appendChild(divHeader);

        divData = divData.cloneNode(false);
        divData.textContent = this.numberOfAnswers;
        div.appendChild(divData);
        //---

        // Количество правильных ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Правильных ответов";
        div.appendChild(divHeader);

        divData = divData.cloneNode(false);
        divData.style.color = _CSS_ROOT.ACCEPT_FIRST_COLOR;
        divData.textContent = this.numberOfTrueAnswers;
        div.appendChild(divData);
        //---

        // Количество неправильных ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Неправильных ответов";
        div.appendChild(divHeader);

        divData = divData.cloneNode(false);
        divData.style.color = _CSS_ROOT.DENY_FIRST_COLOR;
        divData.textContent = this.numberOfFalseAnswers;
        div.appendChild(divData);
        //---

        // Генерируем столько столбцов, сколько элементов ---
        let gridColumnsStr = "";
        for (let i = 0; i < div.childElementCount / 2; i++) {
            gridColumnsStr += "1fr ";
        }

        div.style.gridTemplateColumns = gridColumnsStr.trim();
        //---

        return div;
    }
}