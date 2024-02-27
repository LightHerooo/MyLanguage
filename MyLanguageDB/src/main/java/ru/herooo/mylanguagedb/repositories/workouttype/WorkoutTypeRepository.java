package ru.herooo.mylanguagedb.repositories.workouttype;

import java.util.Optional;

public interface WorkoutTypeRepository<T> {
    Optional<T> find(WorkoutTypes workoutTypes);
}
