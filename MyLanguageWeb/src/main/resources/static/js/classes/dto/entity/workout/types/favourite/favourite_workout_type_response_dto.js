import {
    WorkoutTypeResponseDTO
} from "../../../workout_type/response/workout_type_response_dto.js";

export class FavouriteWorkoutTypeResponseDTO {
    #numberOfWorkouts;
    #workoutType;

    constructor(json) {
        if (json) {
            this.#numberOfWorkouts = json["number_of_workouts"];

            let workoutType = json["workout_type"];
            if (workoutType) {
                this.#workoutType = new WorkoutTypeResponseDTO(workoutType);
            }
        }
    }

    getNumberOfWorkouts() {
        return this.#numberOfWorkouts;
    }

    getWorkoutType() {
        return this.#workoutType;
    }
}