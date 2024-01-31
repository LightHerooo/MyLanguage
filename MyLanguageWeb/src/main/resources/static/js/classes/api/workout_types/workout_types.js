class WorkoutType {
    ID;
    CODE;

    constructor(id, code) {
        this.ID = id;
        this.CODE = code;
    }
}

export class WorkoutTypes {
    RANDOM_WORDS = new WorkoutType(1, "random_words");
    COLLECTION_WORKOUT = new WorkoutType(2, "collection_workout");
}