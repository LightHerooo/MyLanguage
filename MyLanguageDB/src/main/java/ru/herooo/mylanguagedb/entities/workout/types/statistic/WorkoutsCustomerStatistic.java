package ru.herooo.mylanguagedb.entities.workout.types.statistic;

import java.util.Optional;

public interface WorkoutsCustomerStatistic {
    Optional<Long> getCustomerId();
    Optional<Long> getNumberOfWorkouts();
    Optional<Long> getNumberOfMilliseconds();
    Optional<Long> getNumberOfRounds();
    Optional<Long> getNumberOfAnswers();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
    Optional<Double> getSuccessRate();
}
