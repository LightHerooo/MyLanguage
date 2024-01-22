package ru.herooo.mylanguagedb.repositories.workouttype;

public interface WorkoutTypeRepository<T> {
    T findById(WorkoutTypes workoutTypes);
}
