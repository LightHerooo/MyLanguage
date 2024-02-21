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

    createDiv() {
        // Создаём основной контейнер ---
        let div = document.createElement("div");
        div.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_CONTAINER_STYLE_ID);
        //---

        // Количество неправильных ответов ---
        let divHeader = document.createElement("div");
        divHeader.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        divHeader.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_HEADER);
        divHeader.textContent = "Неправильных ответов";

        this.#divNumberOfFalseAnswers = document.createElement("div");
        this.#divNumberOfFalseAnswers.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        this.#divNumberOfFalseAnswers.classList.add(_CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_STYLE_ID);
        this.#divNumberOfFalseAnswers.style.color = _CSS_ROOT.DENY_FIRST_COLOR;
        this.#divNumberOfFalseAnswers.id = _DIV_NUMBER_OF_FALSE_ANSWERS_ID;
        this.#divNumberOfFalseAnswers.textContent = this.numberOfFalseAnswers;

        div.appendChild(divHeader);
        div.appendChild(this.#divNumberOfFalseAnswers);
        //---

        // Количество вопросов без ответа (оставшихся) ---
        divHeader = divHeader.cloneNode(true);
        divHeader.textContent = "Осталось вопросов";

        this.#divNumberOfQuestionsWithoutAnswer = document.createElement("div");
        this.#divNumberOfQuestionsWithoutAnswer.classList.add(
            _CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_STYLE_ID);
        this.#divNumberOfQuestionsWithoutAnswer.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        this.#divNumberOfQuestionsWithoutAnswer.id = _DIV_NUMBER_OF_QUESTIONS_WITHOUT_ANSWER_ID;
        this.#divNumberOfQuestionsWithoutAnswer.textContent = this.numberOfQuestionsWithoutAnswer;

        div.appendChild(divHeader);
        div.appendChild(this.#divNumberOfQuestionsWithoutAnswer);
        //---

        // Количество правильных ответов ---
        divHeader = divHeader.cloneNode(true);
        divHeader.textContent = "Правильных ответов";

        this.#divNumberOfTrueAnswers = document.createElement("div");
        this.#divNumberOfTrueAnswers.classList.add(_CSS_MAIN.DIV_INFO_BLOCK_STANDARD_STYLE_ID);
        this.#divNumberOfTrueAnswers.classList.add(
            _CSS_WORKOUT_ROUND_STATISTIC.DIV_WORKOUT_ROUND_STATISTIC_ITEM_STYLE_ID);
        this.#divNumberOfTrueAnswers.style.color = _CSS_ROOT.ACCEPT_FIRST_COLOR;
        this.#divNumberOfTrueAnswers.id = _DIV_NUMBER_OF_TRUE_ANSWERS_ID;
        this.#divNumberOfTrueAnswers.textContent = this.numberOfTrueAnswers;

        div.appendChild(divHeader);
        div.appendChild(this.#divNumberOfTrueAnswers);
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

        this.#divNumberOfFalseAnswers.textContent = this.numberOfFalseAnswers;
        this.#divNumberOfQuestionsWithoutAnswer.textContent = this.numberOfQuestionsWithoutAnswer;
        this.#divNumberOfTrueAnswers.textContent = this.numberOfTrueAnswers;
    }
}