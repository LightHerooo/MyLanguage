import {
    DivWithTimerAbstractElement
} from "../../../abstracts/div_with_timer_abstract_element.js";

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
    CssInfoBlockHeader
} from "../../../../../css/info_block/css_info_block_header.js";

import {
    TableAbstractElement
} from "../../../../table/abstracts/table_abstract_element.js";

import {
    CssTableElement
} from "../../../../../css/table/css_table_element.js";

import {
    CssRoot
} from "../../../../../css/css_root.js";

import {
    TableElementWorkoutAnswersStatisticUtils
} from "../../../../table/entity/workout/statistic/answers/table_element_workout_answers_statistic_utils.js";

import {
    ImgSrcs
} from "../../../../img_srcs.js";

import {
    WorkoutRoundStatisticResponseDTO
} from "../../../../../dto/entity/workout/types/statistic/workout_round_statistic_response_dto.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();
const _CSS_INFO_BLOCK_HEADER = new CssInfoBlockHeader();
const _CSS_TABLE_ELEMENT = new CssTableElement();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();
const _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS = new TableElementWorkoutAnswersStatisticUtils();

export class DivWithTimerElementWorkoutRoundStatisticNotOver extends DivWithTimerAbstractElement {
    #workoutId;
    #roundNumber;

    #tableElementWorkoutQuestionsWithoutAnswers;
    #tableElementWorkoutTrueAnswers;
    #tableElementWorkoutFalseAnswers;
    #tableElementWorkoutSuccessRate;

    constructor(div) {
        super(div);
    }

    setWorkoutId(workoutId) {
        this.#workoutId = workoutId;
    }

    setRoundNumber(roundNumber) {
        this.#roundNumber = roundNumber;
    }


    #checkCorrectValuesBeforeTryToCreateContent() {
        let isCorrect = true;

        let workoutId = this.#workoutId;
        if (!workoutId) {
            isCorrect = false;
            this.showRule(_RULE_TYPES.ERROR, "Id тренировки не установлен");
        }

        if (isCorrect) {
            let roundNumber = this.#roundNumber;
            if (!roundNumber) {
                isCorrect = false;
                this.showRule(_RULE_TYPES.ERROR, "Номер раунда не установлен");
            }
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
                div.style.grid = "60px 1fr / 1fr";
                div.style.gap = "10px";

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
                let divStatistic = document.createElement("div");
                divStatistic.style.display = "grid";
                divStatistic.style.grid = "1fr 1fr 1fr 1fr / 1fr";
                divStatistic.style.gap = "10px";

                // Осталось вопросов
                let tableElementWorkoutQuestionsWithoutAnswers =
                    new TableElementWorkoutQuestionsWithoutAnswers(null, null, null, null);
                tableElementWorkoutQuestionsWithoutAnswers.buildNewTable();

                let numberOfQuestions = workoutRoundStatisticResponseDTO.getNumberOfQuestions();
                let numberOfAnswers = 0;
                let workoutAnswersStatistic = workoutRoundStatisticResponseDTO.getWorkoutAnswersStatistic();
                if (workoutAnswersStatistic) {
                    numberOfAnswers = workoutAnswersStatistic.getNumberOfAnswers();
                }

                tableElementWorkoutQuestionsWithoutAnswers.setNumberOfQuestionsWithoutAnswers(
                    numberOfQuestions - numberOfAnswers);
                await tableElementWorkoutQuestionsWithoutAnswers.prepare();
                await tableElementWorkoutQuestionsWithoutAnswers.fill();

                let table = tableElementWorkoutQuestionsWithoutAnswers.getTable();
                if (table) {
                    divStatistic.appendChild(table);
                }

                this.#tableElementWorkoutQuestionsWithoutAnswers = tableElementWorkoutQuestionsWithoutAnswers;

                // Правильных ответов
                let tableElementWorkoutTrueAnswers = new TableElementWorkoutTrueAnswers(
                    null, null, null, null);
                tableElementWorkoutTrueAnswers.buildNewTable();
                if (workoutAnswersStatistic) {
                    tableElementWorkoutTrueAnswers.setNumberOfTrueAnswers(workoutAnswersStatistic.getNumberOfTrueAnswers());
                }

                await tableElementWorkoutTrueAnswers.prepare();
                await tableElementWorkoutTrueAnswers.fill();

                table = tableElementWorkoutTrueAnswers.getTable();
                if (table) {
                    divStatistic.appendChild(table);
                }

                this.#tableElementWorkoutTrueAnswers = tableElementWorkoutTrueAnswers;

                // Неправильных ответов
                let tableElementWorkoutFalseAnswers = new TableElementWorkoutFalseAnswers(
                    null, null, null, null);
                tableElementWorkoutFalseAnswers.buildNewTable();
                if (workoutAnswersStatistic) {
                    tableElementWorkoutFalseAnswers.setNumberOfFalseAnswers(workoutAnswersStatistic.getNumberOfFalseAnswers());
                }

                await tableElementWorkoutFalseAnswers.prepare();
                await tableElementWorkoutFalseAnswers.fill();

                table = tableElementWorkoutFalseAnswers.getTable();
                if (table) {
                    divStatistic.appendChild(table);
                }

                this.#tableElementWorkoutFalseAnswers = tableElementWorkoutFalseAnswers;

                // Процент успешности
                let tableElementWorkoutSuccessRate = new TableElementWorkoutSuccessRate(
                    null, null, null, null);
                tableElementWorkoutSuccessRate.buildNewTable();
                if (workoutAnswersStatistic) {
                    tableElementWorkoutSuccessRate.setSuccessRate(workoutAnswersStatistic.getSuccessRate());
                }

                await tableElementWorkoutSuccessRate.prepare();
                await tableElementWorkoutSuccessRate.fill();

                table = tableElementWorkoutSuccessRate.getTable();
                if (table) {
                    divStatistic.appendChild(table);
                }

                this.#tableElementWorkoutSuccessRate = tableElementWorkoutSuccessRate;

                let divParent = this.getDiv();
                if (divParent) {
                    this.removeInfoBlockContainerClassStyle();
                    divParent.style.display = "grid";
                }

                div.appendChild(divStatistic);
                //---
            }
        }

        return div;
    }


    changeStatistic(isCorrectAnswer) {
        let tableElementWorkoutQuestionsWithoutAnswers = this.#tableElementWorkoutQuestionsWithoutAnswers;
        if (tableElementWorkoutQuestionsWithoutAnswers) {
            tableElementWorkoutQuestionsWithoutAnswers.decrement();
        }

        let numberOfTrueAnswers;
        let numberOfFalseAnswers;
        let tableElementWorkoutTrueAnswers = this.#tableElementWorkoutTrueAnswers;
        let tableElementWorkoutFalseAnswers = this.#tableElementWorkoutFalseAnswers;
        if (tableElementWorkoutTrueAnswers && tableElementWorkoutFalseAnswers) {
            if (isCorrectAnswer) {
                tableElementWorkoutTrueAnswers.increment();
            } else {
                tableElementWorkoutFalseAnswers.increment()
            }

            numberOfTrueAnswers = tableElementWorkoutTrueAnswers.getNumberOfTrueAnswers();
            numberOfFalseAnswers = tableElementWorkoutFalseAnswers.getNumberOfFalseAnswers();
        }

        let tableElementWorkoutSuccessRate = this.#tableElementWorkoutSuccessRate;
        if (tableElementWorkoutSuccessRate) {
            tableElementWorkoutSuccessRate.calculate(numberOfTrueAnswers, numberOfFalseAnswers);
        }
    }
}

class TableElementWorkoutQuestionsWithoutAnswers extends TableAbstractElement {
    #numberOfQuestionsWithoutAnswers;

    #tdNumberOfQuestionsWithoutAnswers;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setNumberOfQuestionsWithoutAnswers(numberOfQuestionsWithoutAnswers) {
        this.#numberOfQuestionsWithoutAnswers = numberOfQuestionsWithoutAnswers;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let numberOfQuestionsWithoutAnswers = this.#numberOfQuestionsWithoutAnswers;
        if (numberOfQuestionsWithoutAnswers === null || numberOfQuestionsWithoutAnswers === undefined) {
            isCorrect = true;
            this.showMessage("Количество слов без ответа не указано");
        }

        return isCorrect;
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "Осталось вопросов";
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setThead(thead);
        this.setTbody(tbody);
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            let tr = document.createElement("tr");
            tr.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.textContent = this.#numberOfQuestionsWithoutAnswers;
            tr.appendChild(td);

            trsArr.push(tr);

            this.#tdNumberOfQuestionsWithoutAnswers = td;
        }

        return trsArr;
    }

    decrement() {
        let tdNumberOfQuestionsWithoutAnswers = this.#tdNumberOfQuestionsWithoutAnswers;
        if (tdNumberOfQuestionsWithoutAnswers) {
            this.#numberOfQuestionsWithoutAnswers--;
            if (this.#numberOfQuestionsWithoutAnswers < 0) {
                this.#numberOfQuestionsWithoutAnswers = 0;
            }

            tdNumberOfQuestionsWithoutAnswers.textContent = this.#numberOfQuestionsWithoutAnswers;
        }
    }
}

class TableElementWorkoutTrueAnswers extends TableAbstractElement {
    #numberOfTrueAnswers;

    #tdNumberOfTrueAnswers;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    getNumberOfTrueAnswers() {
        return this.#numberOfTrueAnswers;
    }

    setNumberOfTrueAnswers(numberOfTrueAnswers) {
        this.#numberOfTrueAnswers = numberOfTrueAnswers;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let numberOfTrueAnswers = this.#numberOfTrueAnswers;
        if (numberOfTrueAnswers === null || numberOfTrueAnswers === undefined) {
            isCorrect = true;
            this.showMessage("Количество правильных ответов не указано");
        }

        return isCorrect;
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём thead
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);


        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.background = _CSS_ROOT.GREEN_LIGHT_COLOR_STYLE_ID;
        th.textContent = "Правильных ответов";
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setThead(thead);
        this.setTbody(tbody);
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            let tr = document.createElement("tr");
            tr.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.style.background = `rgba(${_CSS_ROOT.GREEN_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
            td.textContent = this.#numberOfTrueAnswers;
            tr.appendChild(td);

            trsArr.push(tr);

            this.#tdNumberOfTrueAnswers = td;
        }

        return trsArr;
    }

    increment() {
        let tdNumberOfTrueAnswers = this.#tdNumberOfTrueAnswers;
        if (tdNumberOfTrueAnswers) {
            this.#numberOfTrueAnswers++;
            tdNumberOfTrueAnswers.textContent = this.#numberOfTrueAnswers;
        }
    }
}

class TableElementWorkoutFalseAnswers extends TableAbstractElement {
    #numberOfFalseAnswers;

    #tdNumberOfFalseAnswers;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    getNumberOfFalseAnswers() {
        return this.#numberOfFalseAnswers;
    }

    setNumberOfFalseAnswers(numberOfFalseAnswers) {
        this.#numberOfFalseAnswers = numberOfFalseAnswers;
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let numberOfFalseAnswers = this.#numberOfFalseAnswers;
        if (numberOfFalseAnswers === null || numberOfFalseAnswers === undefined) {
            isCorrect = true;
            this.showMessage("Количество неправильных ответов не указано");
        }

        return isCorrect;
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.style.background = _CSS_ROOT.RED_LIGHT_COLOR_STYLE_ID;
        th.textContent = "Неправильных ответов";
        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setThead(thead);
        this.setTbody(tbody);
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            let tr = document.createElement("tr");
            tr.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.style.background = `rgba(${_CSS_ROOT.RED_LIGHT_COLOR_RGB_STYLE_ID}, ${_CSS_ROOT.OPACITY_STANDARD_STYLE_ID})`;
            td.textContent = this.#numberOfFalseAnswers;
            tr.appendChild(td);

            trsArr.push(tr);

            this.#tdNumberOfFalseAnswers = td;
        }

        return trsArr;
    }

    increment() {
        let tdNumberOfFalseAnswers = this.#tdNumberOfFalseAnswers;
        if (tdNumberOfFalseAnswers) {
            this.#numberOfFalseAnswers++;
            tdNumberOfFalseAnswers.textContent = this.#numberOfFalseAnswers;
        }
    }
}

class TableElementWorkoutSuccessRate extends TableAbstractElement {
    #successRate;

    #thSuccessRate;
    #tdSuccessRate;

    constructor(table, colgroup, thead, tbody) {
        super(table, colgroup, thead, tbody);
    }

    setSuccessRate(successRate) {
        this.#successRate = successRate.toFixed(2);
    }


    #checkCorrectValuesBeforeTryToCreateTrsArr() {
        let isCorrect = true;

        let successRate = this.#successRate;
        if (successRate === null || successRate === undefined) {
            isCorrect = true;
            this.showMessage("Процент успешности не указан");
        }

        return isCorrect;
    }

    #changeBackgroundBySuccessRate() {
        let thSuccessRate = this.#thSuccessRate;
        let tdSuccessRate = this.#tdSuccessRate;
        if (thSuccessRate && tdSuccessRate) {
            let successRate = this.#successRate;

            let backgroundStyle = _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS.createBackgroundStyleForTh(successRate);
            if (backgroundStyle) {
                thSuccessRate.style.background = backgroundStyle;
            }

            backgroundStyle = _TABLE_ELEMENT_WORKOUT_ANSWERS_STATISTIC_UTILS.createBackgroundStyleForTd(successRate);
            if (backgroundStyle) {
                tdSuccessRate.style.background = backgroundStyle;
            }
        }
    }


    buildNewTable() {
        // Создаём table ---
        let table = document.createElement("table");
        table.classList.add(_CSS_TABLE_ELEMENT.TABLE_ELEMENT_CLASS_ID);
        //---

        // Создаём thead ---
        let thead = document.createElement("thead");
        thead.classList.add(_CSS_TABLE_ELEMENT.THEAD_TABLE_ELEMENT_SMALL_CLASS_ID);

        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.textContent = "Процент успешности";

        this.#thSuccessRate = th;

        tr.appendChild(th);

        thead.appendChild(tr);
        table.appendChild(thead);
        //---

        // Создаём tbody ---
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        //---

        this.setTable(table);
        this.setThead(thead);
        this.setTbody(tbody);
    }

    async tryToCreateTrsArr(giveAccessToShowMessage) {
        let trsArr;

        let isCorrect = this.#checkCorrectValuesBeforeTryToCreateTrsArr();
        if (isCorrect) {
            trsArr = [];

            let tr = document.createElement("tr");
            tr.style.fontSize = _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID;

            let td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.fontWeight = "bold";
            td.textContent = `${this.#successRate}%`;
            tr.appendChild(td);

            trsArr.push(tr);

            this.#tdSuccessRate = td;
            this.#changeBackgroundBySuccessRate();
        }

        return trsArr;
    }

    calculate(numberOfTrueAnswers, numberOfFalseAnswers) {
        let thSuccessRate = this.#thSuccessRate;
        let tdSuccessRate = this.#tdSuccessRate;
        if (thSuccessRate && tdSuccessRate) {
            let sumNumberOfAnswers = numberOfTrueAnswers + numberOfFalseAnswers;

            let successRate = sumNumberOfAnswers
                ? (Number(numberOfTrueAnswers) / Number(sumNumberOfAnswers) * 100).toFixed(2)
                : 0.00;
            tdSuccessRate.textContent = `${successRate}%`;

            this.#successRate = successRate;
            this.#changeBackgroundBySuccessRate();
        }
    }
}