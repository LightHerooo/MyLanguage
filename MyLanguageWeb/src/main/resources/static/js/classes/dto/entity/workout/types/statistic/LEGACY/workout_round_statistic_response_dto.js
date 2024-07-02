import {
    WorkoutAnswersStatisticResponseDTO
} from "../workout_answers_statistic_response_dto.js";

export class WorkoutRoundStatisticResponseDTO {
    #numberOfQuestions;
    #workoutAnswersStatistic;

    constructor(json) {
        if (json) {
            this.#numberOfQuestions = json["number_of_questions"];

            let workoutAnswersStatistic = json["workout_answers_statistic"];
            if (workoutAnswersStatistic) {
                this.#workoutAnswersStatistic = new WorkoutAnswersStatisticResponseDTO(workoutAnswersStatistic);
            }
        }
    }

    getNumberOfQuestions() {
        return this.#numberOfQuestions;
    }

    getWorkoutAnswersStatistic() {
        return this.#workoutAnswersStatistic;
    }
}