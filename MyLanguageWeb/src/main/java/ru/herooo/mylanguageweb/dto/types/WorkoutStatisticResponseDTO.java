package ru.herooo.mylanguageweb.dto.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.types.WorkoutStatistic;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_milliseconds")
    private Long numberOfMilliseconds;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_rounds")
    private Long numberOfRounds;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_answers")
    private Long numberOfAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_true_answers")
    private Long numberOfTrueAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_false_answers")
    private Long numberOfFalseAnswers;

    public WorkoutStatisticResponseDTO(WorkoutStatistic workoutStatistic) {
        this.numberOfMilliseconds = workoutStatistic.getNumberOfMilliseconds().orElse(0L);
        this.numberOfRounds = workoutStatistic.getNumberOfRounds().orElse(0L);
        this.numberOfAnswers = workoutStatistic.getNumberOfAnswers().orElse(0L);
        this.numberOfTrueAnswers = workoutStatistic.getNumberOfTrueAnswers().orElse(0L);
        this.numberOfFalseAnswers = workoutStatistic.getNumberOfFalseAnswers().orElse(0L);
    }

    public Long getNumberOfMilliseconds() {
        return numberOfMilliseconds;
    }

    public void setNumberOfMilliseconds(Long numberOfMilliseconds) {
        this.numberOfMilliseconds = numberOfMilliseconds;
    }

    public Long getNumberOfRounds() {
        return numberOfRounds;
    }

    public void setNumberOfRounds(Long numberOfRounds) {
        this.numberOfRounds = numberOfRounds;
    }

    public Long getNumberOfAnswers() {
        return numberOfAnswers;
    }

    public void setNumberOfAnswers(Long numberOfAnswers) {
        this.numberOfAnswers = numberOfAnswers;
    }

    public Long getNumberOfTrueAnswers() {
        return numberOfTrueAnswers;
    }

    public void setNumberOfTrueAnswers(Long numberOfTrueAnswers) {
        this.numberOfTrueAnswers = numberOfTrueAnswers;
    }

    public Long getNumberOfFalseAnswers() {
        return numberOfFalseAnswers;
    }

    public void setNumberOfFalseAnswers(Long numberOfFalseAnswers) {
        this.numberOfFalseAnswers = numberOfFalseAnswers;
    }
}
