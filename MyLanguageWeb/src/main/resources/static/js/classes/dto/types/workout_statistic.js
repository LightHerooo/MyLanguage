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

    createTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "20%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "20%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "20%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "20%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "20%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
        th.textContent = "Итоговое время";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Количество раундов";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.textContent = "Количество ответов";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.style.background = _CSS_ROOT.DENY_FIRST_COLOR;
        th.textContent = "Неправильных ответов";
        tr.appendChild(th);

        th = th.cloneNode(false);
        th.style.background = _CSS_ROOT.ACCEPT_FIRST_COLOR;
        th.textContent = "Правильных ответов";
        tr.appendChild(th);

        let tHead = document.createElement("thead");
        tHead.appendChild(tr);

        table.appendChild(tHead);
        //---

        // Итоговое время ---
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

        // Количество ответов ---
        td = td.cloneNode(false);
        td.textContent = this.numberOfAnswers;

        tr.appendChild(td);
        //---

        // Количество неправильных ответов ---
        td = td.cloneNode(false);
        td.style.background = `rgba(${_CSS_ROOT.DENY_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        td.textContent = this.numberOfFalseAnswers;

        tr.appendChild(td);
        //---

        // Количество правильных ответов ---
        td = td.cloneNode(false);
        td.style.background = `rgba(${_CSS_ROOT.ACCEPT_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        td.textContent = this.numberOfTrueAnswers;

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