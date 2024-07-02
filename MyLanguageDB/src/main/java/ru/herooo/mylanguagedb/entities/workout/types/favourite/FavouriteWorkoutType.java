package ru.herooo.mylanguagedb.entities.workout.types.favourite;

import java.util.Optional;

public interface FavouriteWorkoutType {
    Optional<String> getWorkoutTypeCode();
    Optional<Long> getNumberOfWorkouts();
}
