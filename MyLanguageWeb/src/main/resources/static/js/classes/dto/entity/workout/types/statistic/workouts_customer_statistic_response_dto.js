import {
    WorkoutAnswersStatisticResponseDTO
} from "./workout_answers_statistic_response_dto.js";

import {
    CustomerResponseDTO
} from "../../../customer/response/customer_response_dto.js";

export class WorkoutsCustomerStatisticResponseDTO {
    #numberOfMilliseconds;
    #numberOfWorkouts;
    #numberOfRounds;
    #customer;
    #workoutAnswersStatistic;

    constructor(json) {
        if (json) {
            this.#numberOfMilliseconds = json["number_of_milliseconds"];
            this.#numberOfWorkouts = json["number_of_workouts"];
            this.#numberOfRounds = json["number_of_rounds"];

            let customer = json["customer"];
            if (customer) {
                this.#customer = new CustomerResponseDTO(customer);
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

    getNumberOfWorkouts() {
        return this.#numberOfWorkouts;
    }

    getNumberOfRounds() {
        return this.#numberOfRounds;
    }

    getCustomer() {
        return this.#customer;
    }

    getWorkoutAnswersStatistic() {
        return this.#workoutAnswersStatistic;
    }
}