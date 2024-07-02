export class WorkoutItemEditAnswerRequestDTO {
    #id;
    #answer;

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getAnswer() {
        return this.#answer;
    }

    setAnswer(answer) {
        this.#answer = answer;
    }
}