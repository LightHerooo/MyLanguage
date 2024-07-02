package ru.herooo.mylanguagedb.entities.workout.types.statistic;

import java.util.Optional;

public interface WorkoutRoundStatistic {
    Optional<Long> getNumberOfQuestions();
    Optional<Long> getNumberOfAnswers();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
    Optional<Double> getSuccessRate();
}
