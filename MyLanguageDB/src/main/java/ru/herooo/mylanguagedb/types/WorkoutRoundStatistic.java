package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface WorkoutRoundStatistic {
    Optional<Long> getNumberOfQuestions();
    Optional<Long> getNumberOfTrueAnswers();
    Optional<Long> getNumberOfFalseAnswers();
    Optional<Long> getNumberOfQuestionsWithoutAnswer();
}
