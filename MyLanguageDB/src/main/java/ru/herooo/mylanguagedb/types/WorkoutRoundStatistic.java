package ru.herooo.mylanguagedb.types;

public interface WorkoutRoundStatistic {
    Long getNumberOfQuestions();
    Long getNumberOfTrueAnswers();
    Long getNumberOfFalseAnswers();
    Long getNumberOfQuestionsWithoutAnswer();
}
