import {
    WorkoutItemResponseDTO
} from "../response/workout_item_response_dto.js";

export class AnswerInfoResponseDTO {
    #message;
    #isCorrect;
    #possibleAnswers;
    #workoutItem;

    constructor(json) {
        if (json) {
            this.#message = json["message"];
            this.#isCorrect = json["is_correct"];
            this.#possibleAnswers = json["possible_answers"];

            let workoutItem = json["workout_item"];
            if (workoutItem) {
                this.#workoutItem = new WorkoutItemResponseDTO(workoutItem);
            }
        }
    }

    getMessage() {
        return this.#message;
    }

    getIsCorrect() {
        return this.#isCorrect;
    }

    getPossibleAnswers() {
        return this.#possibleAnswers;
    }

    getWorkoutItem() {
        return this.#workoutItem;
    }

    getPossibleAnswersStr() {
        let str;
        let possibleAnswers = this.#possibleAnswers;
        if (possibleAnswers) {
            str = possibleAnswers.join(", ");
        }

        return str;
    }
}