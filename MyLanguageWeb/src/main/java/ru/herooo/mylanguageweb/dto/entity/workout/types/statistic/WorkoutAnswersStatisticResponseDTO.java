package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;

public class WorkoutAnswersStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_answers")
    private long numberOfAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_true_answers")
    private long numberOfTrueAnswers;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_false_answers")
    private long numberOfFalseAnswers;

    @JsonProperty("success_rate")
    private double successRate;


    public long getNumberOfAnswers() {
        return numberOfAnswers;
    }

    public void setNumberOfAnswers(long numberOfAnswers) {
        this.numberOfAnswers = numberOfAnswers;
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

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }
}
