import {
    WorkoutResponseDTO
} from "../../workout/response/workout_response_dto.js";

export class WorkoutItemResponseDTO {
    #id;
    #roundNumber;
    #question;
    #answer;
    #isCorrect;
    #dateOfSetAnswer;
    #workout;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#roundNumber = json["round_number"];
            this.#question = json["question"];
            this.#answer = json["answer"];
            this.#isCorrect = json["is_correct"];

            let dateOfSetAnswer = json["date_of_set_answer"];
            if (dateOfSetAnswer) {
                this.#dateOfSetAnswer = new Date(dateOfSetAnswer);
            }

            let workout = json["workout"];
            if (workout) {
                this.#workout = new WorkoutResponseDTO(workout);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getRoundNumber() {
        return this.#roundNumber;
    }

    getQuestion() {
        return this.#question;
    }

    getAnswer() {
        return this.#answer;
    }

    getIsCorrect() {
        return this.#isCorrect;
    }

    getDateOfSetAnswer() {
        return this.#dateOfSetAnswer;
    }

    getWorkout() {
        return this.#workout;
    }
}