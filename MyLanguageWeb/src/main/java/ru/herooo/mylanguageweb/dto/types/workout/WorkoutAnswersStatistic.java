package ru.herooo.mylanguageweb.dto.types.workout;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.types.WorkoutStatistic;
import ru.herooo.mylanguagedb.types.WorkoutsCustomerExtraStatistic;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutAnswersStatistic {
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

    @JsonProperty("percent_of_true_answers")
    private Double percentOfTrueAnswers;

    public WorkoutAnswersStatistic(WorkoutsCustomerExtraStatistic workoutsCustomerExtraStatistic) {
        this.numberOfAnswers = workoutsCustomerExtraStatistic.getNumberOfAnswers().orElse(0L);
        this.numberOfTrueAnswers = workoutsCustomerExtraStatistic.getNumberOfTrueAnswers().orElse(0L);
        this.numberOfFalseAnswers = workoutsCustomerExtraStatistic.getNumberOfFalseAnswers().orElse(0L);
        this.percentOfTrueAnswers = workoutsCustomerExtraStatistic.getPercentOfTrueAnswers().orElse(0.00);
    }

    public WorkoutAnswersStatistic(WorkoutStatistic workoutStatistic) {
        this.numberOfAnswers = workoutStatistic.getNumberOfAnswers().orElse(0L);
        this.numberOfTrueAnswers = workoutStatistic.getNumberOfTrueAnswers().orElse(0L);
        this.numberOfFalseAnswers = workoutStatistic.getNumberOfFalseAnswers().orElse(0L);
        this.percentOfTrueAnswers = workoutStatistic.getPercentOfTrueAnswers().orElse(0.00);
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

    public Double getPercentOfTrueAnswers() {
        return percentOfTrueAnswers;
    }

    public void setPercentOfTrueAnswers(Double percentOfTrueAnswers) {
        this.percentOfTrueAnswers = percentOfTrueAnswers;
    }
}
