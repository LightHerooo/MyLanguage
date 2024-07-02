export class WorkoutAddCollectionWorkoutRequestDTO {
    #customerCollectionId;
    #langOutCode;

    getCustomerCollectionId() {
        return this.#customerCollectionId;
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }

    getLangOutCode() {
        return this.#langOutCode;
    }

    setLangOutCode(langOutCode) {
        this.#langOutCode = langOutCode;
    }
}