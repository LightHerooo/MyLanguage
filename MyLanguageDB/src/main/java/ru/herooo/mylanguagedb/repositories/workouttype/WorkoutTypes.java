package ru.herooo.mylanguagedb.repositories.workouttype;

public enum WorkoutTypes {
    RANDOM_WORDS(1, "random_words"),
    COLLECTION_WORKOUT(2, "collection_workout")

    ;

    public final long ID;
    public final String CODE;

    WorkoutTypes(long id, String code) {
        this.ID = id;
        this.CODE = code;
    }
}
