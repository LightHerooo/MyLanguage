package ru.herooo.mylanguagedb.repositories.workouttype;

public interface WorkoutTypeRepository<T> {
    T find(WorkoutTypes workoutTypes);
}
