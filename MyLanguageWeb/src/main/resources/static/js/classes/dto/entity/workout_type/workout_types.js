export class WorkoutTypes {
    RANDOM_WORDS = new WorkoutType(1n, "random_words");
    COLLECTION_WORKOUT = new WorkoutType(2n, "collection_workout");
}

class WorkoutType {
    ID;
    CODE;

    constructor(id, code) {
        this.ID = id;
        this.CODE = code;
    }
}