package ru.herooo.mylanguagedb.entities.workout.types.favourite;

import java.util.Optional;

public interface FavouriteCustomerCollection {
    Optional<Long> getCustomerCollectionId();
    Optional<Long> getNumberOfWorkouts();
}
