import {
    CssRoot
} from "../../../../../../css/css_root.js";

import {
    CssTableElement
} from "../../../../../../css/elements/table/css_table_element.js";

import {
    TableElementWorkoutAnswersStatisticUtils
} from "./table_element_workout_answers_statistic_utils.js";

import {
    TableAbstractElement
} from "../../../../abstracts/table_abstract_element.js";

const _CSS_ROOT = new CssRoot();
const _CSS_TABLE_ELEMENT = new CssTableElement();

const _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS = new TableElementWorkoutAnswersStatisticUtils();

export class TableElementWorkoutAnswersStatistic extends TableAbstractElement {
    #workoutAnswersStatisticResponseDTO;

    #thSuccessRate;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setWorkoutAnswersStatisticResponseDTO(workoutAnswersStatisticResponseDTOObj) {
        this.#workoutAnswersStatisticResponseDTO = workoutAnswersStatisticResponseDTOObj;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let workoutAnswersStatisticResponseDTO = this.#workoutAnswersStatisticResponseDTO;
        if (!workoutAnswersStatisticResponseDTO) {
            isCorrect = false;
            this.showMessage("Не удалось получить данные об ответах в тренировке", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
    }

    #createTr() {
        let tr;
        let workoutAnswersStatisticResponseDTO = this.#workoutAnswersStatisticResponseDTO;
        if (workoutAnswersStatisticResponseDTO) {
            tr = document.createElement("tr");

            // Количество ответов ---
            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.style.fontSize = _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID;
            td.textContent = workoutAnswersStatisticResponseDTO.getNumberOfAnswers();

            tr.appendChild(td);
            //---

            // Количество правильных ответов ---
            td = td.cloneNode(false);
            td.style.background = `rgba(${_CSS_ROOT.GREEN_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
            td.textContent = workoutAnswersStatisticResponseDTO.getNumberOfTrueAnswers();

            tr.appendChild(td);
            //---

            // Количество неправильных ответов ---
            td = td.cloneNode(false);
            td.style.background = `rgba(${_CSS_ROOT.RED_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
            td.textContent = workoutAnswersStatisticResponseDTO.getNumberOfFalseAnswers();

            tr.appendChild(td);
            //---

            // Процент успешности ---
            td = td.cloneNode(false);

            let successRate = workoutAnswersStatisticResponseDTO.getSuccessRate();
            td.style.background = _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS.createBackgroundStyleForTd(successRate);
            td.textContent = `${successRate}%`;

            tr.appendChild(td);
            //---
        }

        return tr;
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        colgroup.appendChild(col);

        col = document.createElement("col");
        colgroup.appendChild(col);

        col = document.createElement("col");
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "Количество ответов";
        tr.appendChild(th);

        th = document.createElement("th");
        th.style.background = _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID;
        th.textContent = "Правильных ответов";
        tr.appendChild(th);

        th = document.createElement("th");
        th.style.background = _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
        th.textContent = "Неправильных ответов";
        tr.appendChild(th);

        th = document.createElement("th");
        th.textContent = "Процент успешности";
        tr.appendChild(th);

        this.#thSuccessRate = th;

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setColgroup(colgroup);
        this.setThead(thead);
        this.setTbody(tbody);
    }

    async fill() {
        await super.fill();

        let workoutAnswersStatisticResponseDTO = this.#workoutAnswersStatisticResponseDTO;
        if (workoutAnswersStatisticResponseDTO) {
            let successRate = workoutAnswersStatisticResponseDTO.getSuccessRate();

            let thSuccessRate = this.#thSuccessRate;
            if (thSuccessRate) {
                thSuccessRate.style.background = _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS.createBackgroundStyleForTh(
                    successRate);
            }
        }
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;
        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            let tr = this.#createTr();
            if (tr) {
                trsArr.push(tr);
            }
        }

        return trsArr;
    }
}