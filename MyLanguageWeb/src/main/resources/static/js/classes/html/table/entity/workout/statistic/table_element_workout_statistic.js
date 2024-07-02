import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    CssTableElement
} from "../../../../../css/table/css_table_element.js";

import {
    TableAbstractElement
} from "../../../abstracts/table_abstract_element.js";

import {
    TimeParts
} from "../../../../time_parts.js";

const _CSS_ROOT = new CssRoot();
const _CSS_TABLE_ELEMENT = new CssTableElement();

export class TableElementWorkoutStatistic extends TableAbstractElement {
    #workoutStatisticResponseDTO;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setWorkoutStatisticResponseDTO(workoutStatisticResponseDTOObj) {
        this.#workoutStatisticResponseDTO = workoutStatisticResponseDTOObj;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let workoutStatisticResponseDTO = this.#workoutStatisticResponseDTO;
        if (!workoutStatisticResponseDTO) {
            isCorrect = false;
            this.showMessage("Не удалось получить статистику по тренировке", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return isCorrect;
    }

    #createTr() {
        let tr;
        let workoutStatisticResponseDTO = this.#workoutStatisticResponseDTO;
        if (workoutStatisticResponseDTO) {
            tr = document.createElement("tr");

            // Время ---
            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.style.fontSize = _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID;
            td.textContent = new TimeParts(workoutStatisticResponseDTO.getNumberOfMilliseconds())
                .getTimeStr(false, true, true, false);

            tr.appendChild(td);
            //---

            // Количество раундов ---
            td = td.cloneNode(false);
            td.textContent = workoutStatisticResponseDTO.getNumberOfRounds();

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
        col.style.width = "75%";
        colgroup.appendChild(col);

        col = document.createElement("col");
        col.style.width = "25%";
        colgroup.appendChild(col);

        table.appendChild(colgroup);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "Время";
        tr.appendChild(th);

        th = document.createElement("th");
        th.textContent = "Количество раундов";
        tr.appendChild(th);

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