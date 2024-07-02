package ru.herooo.mylanguagedb.entities.workout.types.favourite;

import java.util.Optional;

public interface FavouriteLang {
    Optional<String> getLangCode();
    Optional<Long> getNumberOfWorkouts();
}
