import {
    WorkoutAnswersStatisticResponseDTO
} from "./workout_answers_statistic_response_dto.js";

import {
    WorkoutResponseDTO
} from "../../response/workout_response_dto.js";

export class WorkoutStatisticResponseDTO {
    #numberOfMilliseconds;
    #numberOfRounds;
    #workout;
    #workoutAnswersStatistic;

    constructor(json) {
        if (json) {
            this.#numberOfMilliseconds = json["number_of_milliseconds"];
            this.#numberOfRounds = json["number_of_rounds"];

            let workout = json["workout"];
            if (workout) {
                this.#workout = new WorkoutResponseDTO(workout);
            }

            let workoutAnswersStatistic = json["workout_answers_statistic"];
            if (workoutAnswersStatistic) {
                this.#workoutAnswersStatistic = new WorkoutAnswersStatisticResponseDTO(workoutAnswersStatistic);
            }
        }
    }

    getNumberOfMilliseconds() {
        return this.#numberOfMilliseconds;
    }

    getNumberOfRounds() {
        return this.#numberOfRounds;
    }

    getWorkout() {
        return this.#workout;
    }

    getWorkoutAnswersStatistic() {
        return this.#workoutAnswersStatistic;
    }
}