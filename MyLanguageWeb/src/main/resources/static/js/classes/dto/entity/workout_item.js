import {
    WorkoutResponseDTO
} from "./workout.js";

import {
    CssMain
} from "../../css/css_main.js";

import {
    CssRoot
} from "../../css/css_root.js";

import {
    ImageSources
} from "../../image_sources.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();
const _IMAGE_SOURCES = new ImageSources();

export class WorkoutItemResponseDTO {
    id;
    roundNumber;
    wordTitleQuestion;
    wordTitleAnswer;
    isCorrect;
    dateOfSetAnswer;
    workout;

    constructor(workoutItemJson) {
        if (workoutItemJson) {
            this.id = workoutItemJson["id"];
            this.roundNumber = workoutItemJson["round_number"];
            this.wordTitleQuestion = workoutItemJson["word_title_question"];
            this.wordTitleAnswer = workoutItemJson["word_title_answer"];
            this.isCorrect = workoutItemJson["is_correct"];
            this.dateOfSetAnswer = workoutItemJson["date_of_set_answer"];

            let workout = workoutItemJson["workout"];
            if (workout) {
                this.workout = new WorkoutResponseDTO(workout);
            }
        }
    }

    #createTable() {
        let table = document.createElement("table");
        table.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);
        table.style.margin = "0 -5px";

        // Создаём colgroup ---
        let colgroup = document.createElement("colgroup");

        let colNum = document.createElement("col");
        colNum.style.width = "70px";
        colgroup.appendChild(colNum);

        let colHelp = document.createElement("col");
        colHelp.style.width = "50px";
        colgroup.appendChild(colHelp);

        let colResult = document.createElement("col");
        colResult.style.width = "100%";
        colgroup.appendChild(colResult);

        let colImg = document.createElement("col");
        colImg.style.width = "50px";
        colgroup.appendChild(colImg);

        table.appendChild(colgroup);
        //---

        return table;
    }

    #getColor() {
        return this.isCorrect === true
            ? _CSS_ROOT.ACCEPT_FIRST_COLOR
            : _CSS_ROOT.DENY_FIRST_COLOR;
    }

    #createTdNum(index) {
        let tdNum = document.createElement("td");
        tdNum.style.textAlign = "center";
        tdNum.style.background = this.#getColor();
        tdNum.textContent = `${index}.`;

        return tdNum;
    }

    #createTdHelpQuestion() {
        let tdHelpQuestion = document.createElement("td");
        tdHelpQuestion.style.background = this.#getColor();
        tdHelpQuestion.style.fontWeight = "bold";
        tdHelpQuestion.style.textDecoration = "underline dotted";
        tdHelpQuestion.style.textAlign = "center";
        tdHelpQuestion.title = "Вопрос";
        tdHelpQuestion.textContent = "?";

        return tdHelpQuestion;
    }

    #createTdQuestion() {
        let tdQuestion = document.createElement("td");
        tdQuestion.style.background = this.#getColor();
        tdQuestion.textContent = this.wordTitleQuestion;

        return tdQuestion;
    }

    #createTdHelpAnswer() {
        let tdHelpAnswer = document.createElement("td");
        tdHelpAnswer.style.background = this.#getColor();
        tdHelpAnswer.style.fontWeight = "bold";
        tdHelpAnswer.style.textDecoration = "underline dotted";
        tdHelpAnswer.style.textAlign = "center";
        tdHelpAnswer.title = "Ответ";
        tdHelpAnswer.textContent = "!";

        return tdHelpAnswer;
    }

    #createTdAnswer() {
        let tdQuestion = document.createElement("td");
        tdQuestion.style.background = this.#getColor();
        tdQuestion.textContent = this.wordTitleAnswer;

        return tdQuestion;
    }

    #createTdImg() {
        let tdImg = document.createElement("td");
        tdImg.style.background = this.#getColor();

        let div = document.createElement("div");
        div.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        let img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = this.isCorrect === true
            ? _IMAGE_SOURCES.OTHER.ACCEPT
            : _IMAGE_SOURCES.OTHER.DELETE;
        div.appendChild(img);

        tdImg.appendChild(div);

        return tdImg;
    }

    createTableWithoutAnswer(index) {
        // Создаём таблицу ---
        let table = this.#createTable();
        //---

        // Создаём tBody ---
        let tBody = document.createElement("tbody");
        //---

        // Создаём строку вопроса ---
        let trQuestion = document.createElement("tr");

        trQuestion.appendChild(this.#createTdNum(index));
        trQuestion.appendChild(this.#createTdHelpQuestion());
        trQuestion.appendChild(this.#createTdQuestion());
        trQuestion.appendChild(this.#createTdImg());

        tBody.appendChild(trQuestion);
        //---

        table.appendChild(tBody);

        return table;
    }

    createTableWithAnswer(index) {
        // Создаём таблицу ---
        let table = this.#createTable();
        //---

        // Создаём tBody ---
        let tBody = document.createElement("tbody");
        //---

        // Создаём строку вопроса ---
        let trQuestion = document.createElement("tr");

        let tdNum = this.#createTdNum(index);
        tdNum.colSpan = 2;
        trQuestion.appendChild(tdNum);

        trQuestion.appendChild(this.#createTdHelpQuestion());
        trQuestion.appendChild(this.#createTdQuestion());

        let tdImg = this.#createTdImg();
        tdImg.colSpan = 2;
        trQuestion.appendChild(tdImg);

        tBody.appendChild(trQuestion);
        //---

        // Создаём строку ответа ---
        let trAnswer = document.createElement("tr");

        trAnswer.appendChild(this.#createTdHelpAnswer());
        trAnswer.appendChild(this.#createTdAnswer());

        tBody.appendChild(trAnswer);
        //---

        table.appendChild(tBody);

        return table;
    }
}

export class WorkoutItemRequestDTO {
    id;
    wordTitleAnswer;
}

export class AnswerResultResponseDTO {
    isCorrect;
    possibleAnswers;
    workoutItem;

    constructor(answerResultJson) {
        if (answerResultJson) {
            this.isCorrect = answerResultJson["is_correct"];
            this.possibleAnswers = answerResultJson["possible_answers"];

            let workoutItem = answerResultJson["workout_item"];
            if (workoutItem) {
                this.workoutItem = new WorkoutItemResponseDTO(workoutItem);
            }
        }
    }

    getPossibleAnswersStr() {
        let result = "";
        if (this.possibleAnswers) {
            for (let answer of this.possibleAnswers) {
                result += answer + ", ";
            }

            result = result.substring(0, result.length - 2);
        }

        return result;
    }
}