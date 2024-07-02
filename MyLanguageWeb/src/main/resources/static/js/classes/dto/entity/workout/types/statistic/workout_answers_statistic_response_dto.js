export class WorkoutAnswersStatisticResponseDTO {
    #numberOfAnswers;
    #numberOfTrueAnswers;
    #numberOfFalseAnswers;
    #successRate;

    constructor(json) {
        if (json) {
            this.#numberOfAnswers = json["number_of_answers"];
            this.#numberOfTrueAnswers = json["number_of_true_answers"];
            this.#numberOfFalseAnswers = json["number_of_false_answers"];
            this.#successRate = json["success_rate"];
        }
    }

    getNumberOfAnswers() {
        return this.#numberOfAnswers;
    }

    getNumberOfTrueAnswers() {
        return this.#numberOfTrueAnswers;
    }

    getNumberOfFalseAnswers() {
        return this.#numberOfFalseAnswers;
    }

    getSuccessRate() {
        return this.#successRate;
    }
}