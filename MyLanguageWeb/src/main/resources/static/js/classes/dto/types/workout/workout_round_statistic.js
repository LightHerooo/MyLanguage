import {
    CssMain
} from "../../../css/css_main.js";

import {
    CssRoot
} from "../../../css/css_root.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();

export class WorkoutRoundStatisticResponseDTO {
    numberOfQuestions;
    numberOfTrueAnswers;
    numberOfFalseAnswers;
    numberOfQuestionsWithoutAnswer;

    #tdNumberOfTrueAnswers;
    #tdNumberOfFalseAnswers;
    #tdNumberOfQuestionsWithoutAnswer;

    constructor(workoutRoundStatisticJson) {
        if (workoutRoundStatisticJson) {
            this.numberOfQuestions = workoutRoundStatisticJson["number_of_questions"];
            this.numberOfTrueAnswers = workoutRoundStatisticJson["number_of_true_answers"];
            this.numberOfFalseAnswers = workoutRoundStatisticJson["number_of_false_answers"];
            this.numberOfQuestionsWithoutAnswer = workoutRoundStatisticJson["number_of_questions_without_answer"];
        }
    }

    createTableNotOver() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
        th.textContent = "Осталось вопросов";
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

        // Осталось вопросов ---
        tr = document.createElement("tr");

        let td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        td.textContent = this.numberOfQuestionsWithoutAnswer;
        tr.appendChild(td);

        this.#tdNumberOfQuestionsWithoutAnswer = td;
        //---

        // Неправильных ответов ---
        td = td.cloneNode(false);
        td.style.background = `rgba(${_CSS_ROOT.DENY_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        td.textContent = this.numberOfFalseAnswers;
        tr.appendChild(td);

        this.#tdNumberOfFalseAnswers = td;
        //---

        // Правильных ответов ---
        td = td.cloneNode(false);
        td.style.background = `rgba(${_CSS_ROOT.ACCEPT_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        td.textContent = this.numberOfTrueAnswers;
        tr.appendChild(td);

        this.#tdNumberOfTrueAnswers = td;
        //---

        // Создаём tBody ---
        let tBody = document.createElement("tbody");
        tBody.appendChild(tr);

        table.appendChild(tBody);
        //---

        return table;
    }

    createTableOver() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "33%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём tHead ---
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;
        th.textContent = "Количество вопросов";
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

        // Количество вопросов ---
        tr = document.createElement("tr");

        let td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = _CSS_ROOT.SECOND_FONT_SIZE;
        td.textContent = this.numberOfQuestions;
        tr.appendChild(td);
        //---

        // Неправильных ответов ---
        td = td.cloneNode(false);
        td.style.background = `rgba(${_CSS_ROOT.DENY_FIRST_COLOR_RGB}, ${_CSS_ROOT.OPACITY_STANDARD})`;
        td.textContent = this.numberOfFalseAnswers;
        tr.appendChild(td);
        //---

        // Правильных ответов ---
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

    changeStatistic(isCorrect) {
        this.numberOfQuestionsWithoutAnswer--;

        if (isCorrect === true) {
            this.numberOfTrueAnswers++;
        } else {
            this.numberOfFalseAnswers++;
        }

        let tdNumberOfFalseAnswers = this.#tdNumberOfFalseAnswers;
        if (tdNumberOfFalseAnswers) {
            tdNumberOfFalseAnswers.textContent = this.numberOfFalseAnswers;
        }

        let tdNumberOfQuestionsWithoutAnswer = this.#tdNumberOfQuestionsWithoutAnswer;
        if (tdNumberOfQuestionsWithoutAnswer) {
            tdNumberOfQuestionsWithoutAnswer.textContent = this.numberOfQuestionsWithoutAnswer
        }

        let tdNumberOfTrueAnswers = this.#tdNumberOfTrueAnswers;
        if (tdNumberOfTrueAnswers) {
            tdNumberOfTrueAnswers.textContent = this.numberOfTrueAnswers;
        }
    }
}