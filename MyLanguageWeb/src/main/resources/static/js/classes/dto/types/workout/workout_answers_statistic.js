import {
    CssMain
} from "../../../css/css_main.js";

import {
    CssRoot
} from "../../../css/css_root.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

export class WorkoutAnswersStatistic {
    numberOfAnswers;
    numberOfTrueAnswers;
    numberOfFalseAnswers;
    percentOfTrueAnswers;

    constructor(workoutAnswersStatisticJson) {
        this.numberOfAnswers = workoutAnswersStatisticJson["number_of_answers"];
        this.numberOfTrueAnswers = workoutAnswersStatisticJson["number_of_true_answers"];
        this.numberOfFalseAnswers = workoutAnswersStatisticJson["number_of_false_answers"];
        this.percentOfTrueAnswers = workoutAnswersStatisticJson["percent_of_true_answers"];
    }

    createTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Мы должны отпределиться с цветом колонки процента правильных ответов ---
        let colorForThPercentage;
        let colorForTdPercentage;
        let percentAfterFloor = Math.floor(this.percentOfTrueAnswers);
        if (percentAfterFloor >= 60) {
            colorForThPercentage = _CSS_ROOT.ACCEPT_FIRST_COLOR;
            colorForTdPercentage = `rgba(${_CSS_ROOT.ACCEPT_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        } else if (percentAfterFloor >= 30) {
            colorForThPercentage = _CSS_ROOT.WARNING_FIRST_COLOR;
            colorForTdPercentage = `rgba(${_CSS_ROOT.WARNING_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        } else {
            colorForThPercentage = _CSS_ROOT.DENY_FIRST_COLOR;
            colorForTdPercentage = `rgba(${_CSS_ROOT.DENY_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        }
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
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

        th = th.cloneNode(false);
        th.style.background = colorForThPercentage;
        th.textContent = "Процент успеха";
        tr.appendChild(th);

        let tHead = document.createElement("thead");
        tHead.appendChild(tr);

        table.appendChild(tHead);
        //---

        // Количество ответов ---
        tr = document.createElement("tr");

        let td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
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

        // Процент правильных ответов ---
        td = td.cloneNode(false);
        td.style.background = colorForTdPercentage;
        td.textContent = `${this.percentOfTrueAnswers}%`;

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