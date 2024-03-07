package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface WorkoutStatistic {
    Optional<Long> getNumberOfMilliseconds();
    Optional<Long> getNumberOfRounds();
    Optional<Long> getNumberOfAnswers();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
}
