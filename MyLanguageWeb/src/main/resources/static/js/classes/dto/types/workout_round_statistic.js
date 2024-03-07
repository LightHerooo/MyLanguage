import {
    CssMain
} from "../../css/css_main.js";

import {
    CssWorkoutRoundStatistic
} from "../../css/types/css_workout_round_statistic.js";

import {
    CssRoot
} from "../../css/css_root.js";

const _CSS_MAIN = new CssMain();
const _CSS_ROOT = new CssRoot();
const _CSS_WORKOUT_ROUND_STATISTIC = new CssWorkoutRoundStatistic();

const _DIV_NUMBER_OF_FALSE_ANSWERS_ID = "div_number_of_false_answers";
const _DIV_NUMBER_OF_QUESTIONS_WITHOUT_ANSWER_ID = "div_number_of_questions_without_answer";
const _DIV_NUMBER_OF_TRUE_ANSWERS_ID = "div_number_of_true_answers";

export class WorkoutRoundStatisticResponseDTO {
    numberOfQuestions;
    numberOfTrueAnswers;
    numberOfFalseAnswers;
    numberOfQuestionsWithoutAnswer;

    #divNumberOfTrueAnswers;
    #divNumberOfFalseAnswers;
    #divNumberOfQuestionsWithoutAnswer;

    constructor(workoutRoundStatisticJson) {
        if (workoutRoundStatisticJson) {
            this.numberOfQuestions = workoutRoundStatisticJson["number_of_questions"];
            this.numberOfTrueAnswers = workoutRoundStatisticJson["number_of_true_answers"];
            this.numberOfFalseAnswers = workoutRoundStatisticJson["number_of_false_answers"];
            this.numberOfQuestionsWithoutAnswer = workoutRoundStatisticJson["number_of_questions_without_answer"];
        }
    }

    createDivNotOver() {
        // Создаём основной контейнер ---
        let div = document.createElement("div");
        div.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_CONTAINER_STYLE_ID);
        //---

        // Количество неправильных ответов ---
        let divHeader = document.createElement("div");
        divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divHeader.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_HEADER);
        divHeader.textContent = "Неправильных ответов";

        let divAnswers = document.createElement("div");
        divAnswers.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divAnswers.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_STYLE_ID);
        divAnswers.style.color = _CSS_ROOT.DENY_FIRST_COLOR;
        divAnswers.id = _DIV_NUMBER_OF_FALSE_ANSWERS_ID;
        divAnswers.textContent = this.numberOfFalseAnswers;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        this.#divNumberOfFalseAnswers = divAnswers;
        //---

        // Количество вопросов без ответа (оставшихся) ---
        divHeader = divHeader.cloneNode(true);
        divHeader.textContent = "Осталось вопросов";

        divAnswers = divAnswers.cloneNode(false);
        divAnswers.style.color = "";
        divAnswers.id = _DIV_NUMBER_OF_QUESTIONS_WITHOUT_ANSWER_ID;
        divAnswers.textContent = this.numberOfQuestionsWithoutAnswer;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        this.#divNumberOfQuestionsWithoutAnswer = divAnswers;
        //---

        // Количество правильных ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Правильных ответов";

        divAnswers = divAnswers.cloneNode(false);
        divAnswers.style.color = _CSS_ROOT.ACCEPT_FIRST_COLOR;
        divAnswers.id = _DIV_NUMBER_OF_TRUE_ANSWERS_ID;
        divAnswers.textContent = this.numberOfTrueAnswers;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        this.#divNumberOfTrueAnswers = divAnswers;
        //---

        return div;
    }

    createDivOver() {
        // Создаём основной контейнер ---
        let div = document.createElement("div");
        div.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_CONTAINER_STYLE_ID);
        //---

        // Общее количество вопросов ---
        let divHeader = document.createElement("div");
        divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divHeader.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_HEADER);
        divHeader.textContent = "Количество вопросов";

        let divAnswers = document.createElement("div");
        divAnswers.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divAnswers.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_STYLE_ID);
        divAnswers.textContent = this.numberOfQuestions;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        //---

        // Количество неправильных ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Неправильных ответов";

        divAnswers = divAnswers.cloneNode(false);
        divAnswers.style.color = _CSS_ROOT.DENY_FIRST_COLOR;
        divAnswers.textContent = this.numberOfFalseAnswers;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        //---

        // Количество правильных ответов ---
        divHeader = divHeader.cloneNode(false);
        divHeader.textContent = "Правильных ответов";

        divAnswers = divAnswers.cloneNode(false);
        divAnswers.style.color = _CSS_ROOT.ACCEPT_FIRST_COLOR;
        divAnswers.textContent = this.numberOfTrueAnswers;

        div.appendChild(divHeader);
        div.appendChild(divAnswers);
        //---

        return div;
    }

    changeStatistic(isCorrect) {
        this.numberOfQuestionsWithoutAnswer--;

        if (isCorrect === true) {
            this.numberOfTrueAnswers++;
        } else {
            this.numberOfFalseAnswers++;
        }

        let divNumberOfFalseAnswers = this.#divNumberOfFalseAnswers;
        if (divNumberOfFalseAnswers) {
            divNumberOfFalseAnswers.textContent = this.numberOfFalseAnswers;
        }

        let divNumberOfQuestionsWithoutAnswer = this.#divNumberOfQuestionsWithoutAnswer;
        if (divNumberOfQuestionsWithoutAnswer) {
            divNumberOfQuestionsWithoutAnswer.textContent = this.numberOfQuestionsWithoutAnswer
        }

        let divNumberOfTrueAnswers = this.#divNumberOfTrueAnswers;
        if (divNumberOfTrueAnswers) {
            divNumberOfTrueAnswers.textContent = this.numberOfTrueAnswers;
        }
    }
}