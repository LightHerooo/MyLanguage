package ru.herooo.mylanguageweb.dto.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutRoundStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_questions")
    long numberOfQuestions;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_true_answers")
    long numberOfTrueAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_false_answers")
    long numberOfFalseAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_questions_without_answer")
    long numberOfQuestionsWithoutAnswer;

    public WorkoutRoundStatisticResponseDTO(WorkoutRoundStatistic workoutRoundStatistic) {
        numberOfQuestions = workoutRoundStatistic.getNumberOfQuestions().orElse(0L);
        numberOfTrueAnswers = workoutRoundStatistic.getNumberOfTrueAnswers().orElse(0L);
        numberOfFalseAnswers = workoutRoundStatistic.getNumberOfFalseAnswers().orElse(0L);
        numberOfQuestionsWithoutAnswer = workoutRoundStatistic.getNumberOfQuestionsWithoutAnswer().orElse(0L);
    }

    public long getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(long numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public long getNumberOfTrueAnswers() {
        return numberOfTrueAnswers;
    }

    public void setNumberOfTrueAnswers(long numberOfTrueAnswers) {
        this.numberOfTrueAnswers = numberOfTrueAnswers;
    }

    public long getNumberOfFalseAnswers() {
        return numberOfFalseAnswers;
    }

    public void setNumberOfFalseAnswers(long numberOfFalseAnswers) {
        this.numberOfFalseAnswers = numberOfFalseAnswers;
    }

    public long getNumberOfQuestionsWithoutAnswer() {
        return numberOfQuestionsWithoutAnswer;
    }

    public void setNumberOfQuestionsWithoutAnswer(long numberOfQuestionsWithoutAnswer) {
        this.numberOfQuestionsWithoutAnswer = numberOfQuestionsWithoutAnswer;
    }
}
