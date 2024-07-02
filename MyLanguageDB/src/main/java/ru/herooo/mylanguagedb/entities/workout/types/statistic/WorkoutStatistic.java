package ru.herooo.mylanguagedb.entities.workout.types.statistic;

import java.util.Optional;

public interface WorkoutStatistic {
    Optional<Long> getWorkoutId();
    Optional<Long> getNumberOfMilliseconds();
    Optional<Integer> getNumberOfRounds();
    Optional<Long> getNumberOfAnswers();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
    Optional<Double> getSuccessRate();
}
