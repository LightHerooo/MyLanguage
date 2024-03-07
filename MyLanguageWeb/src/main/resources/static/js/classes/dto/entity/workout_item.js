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

    #getColor() {
        return this.isCorrect === true
            ? _CSS_ROOT.ACCEPT_FIRST_COLOR
            : _CSS_ROOT.DENY_FIRST_COLOR;
    }

    createTrQuestion(index, isNextTrAnswer) {
        let trQuestion = document.createElement("tr");

        // Колонка № ---
        let tdNum = document.createElement("td");
        tdNum.style.background = this.#getColor();
        tdNum.style.textAlign = "center";
        tdNum.textContent = `${index}.`;
        if (isNextTrAnswer === true) {
            tdNum.rowSpan = 2;
        }

        trQuestion.appendChild(tdNum);
        //---

        // Колонка подсказки ---
        let tdHelpQuestion = document.createElement("td");
        tdHelpQuestion.style.background = this.#getColor();
        tdHelpQuestion.style.fontWeight = "bold";
        tdHelpQuestion.style.textDecoration = "underline dotted";
        tdHelpQuestion.style.textAlign = "center";
        tdHelpQuestion.title = "Вопрос";
        tdHelpQuestion.textContent = "?";

        trQuestion.appendChild(tdHelpQuestion);
        //---

        // Колонка вопроса ---
        let tdQuestion = document.createElement("td");
        tdQuestion.style.background = this.#getColor();
        tdQuestion.textContent = this.wordTitleQuestion;

        trQuestion.appendChild(tdQuestion);
        //---

        // Колонка изображения корректности ---
        let div = document.createElement("div");
        div.classList.add(_CSS_MAIN.DIV_CONTENT_CENTER_STANDARD_STYLE_ID);

        let img = document.createElement("img");
        img.style.width = "32px";
        img.style.height = "32px";
        img.src = this.isCorrect === true
            ? _IMAGE_SOURCES.OTHER.ACCEPT
            : _IMAGE_SOURCES.OTHER.DELETE;
        div.appendChild(img);

        let tdImg = document.createElement("td");
        tdImg.style.background = this.#getColor();
        if (isNextTrAnswer === true) {
            tdImg.rowSpan = 2;
        }
        tdImg.appendChild(div);

        trQuestion.appendChild(tdImg);
        //---

        return trQuestion;
    }

    createTrAnswer() {
        let trAnswer = document.createElement("tr");

        // Колонка подсказки ---
        let tdHelpAnswer = document.createElement("td");
        tdHelpAnswer.style.background = this.#getColor();
        tdHelpAnswer.style.fontWeight = "bold";
        tdHelpAnswer.style.textDecoration = "underline dotted";
        tdHelpAnswer.style.textAlign = "center";
        tdHelpAnswer.title = "Ответ";
        tdHelpAnswer.textContent = "!";

        trAnswer.appendChild(tdHelpAnswer);
        //---

        // Колонка ответа ---
        let tdAnswer = document.createElement("td");
        tdAnswer.style.background = this.#getColor();
        tdAnswer.textContent = this.wordTitleAnswer;

        trAnswer.appendChild(tdAnswer);
        //---

        return trAnswer;
    }
}

export class WorkoutItemRequestDTO {
    id;
    wordTitleAnswer;
}

export class AnswerResultResponseDTO {
    message;
    isCorrect;
    possibleAnswers;
    workoutItem;

    constructor(answerResultJson) {
        if (answerResultJson) {
            this.message = answerResultJson["message"];
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