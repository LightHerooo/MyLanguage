package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface WorkoutsCustomerExtraStatistic {
    Optional<Long> getCustomerId();
    Optional<Long> getNumberOfMilliseconds();
    Optional<Long> getNumberOfWorkouts();
    Optional<Long> getNumberOfRounds();
    Optional<Long> getNumberOfAnswers();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
    Optional<Double> getPercentOfTrueAnswers();

    Optional<String> getFavouriteLangInCode();
    Optional<String> getFavouriteLangOutCode();
    Optional<String> getFavouriteWorkoutTypeCode();
    Optional<Long> getFavouriteCustomerCollectionId();
}
