package ru.herooo.mylanguageweb.dto.types.workout.workout_statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.types.workout.WorkoutAnswersStatistic;

public class WorkoutStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_milliseconds")
    private Long numberOfMilliseconds;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_rounds")
    private Long numberOfRounds;

    @JsonProperty("workout_answers_statistic")
    private WorkoutAnswersStatistic workoutAnswersStatistic;

    @JsonProperty("workout")
    private WorkoutResponseDTO workout;

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

    public WorkoutAnswersStatistic getWorkoutAnswersStatistic() {
        return workoutAnswersStatistic;
    }

    public void setWorkoutAnswersStatistic(WorkoutAnswersStatistic workoutAnswersStatistic) {
        this.workoutAnswersStatistic = workoutAnswersStatistic;
    }

    public WorkoutResponseDTO getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutResponseDTO workout) {
        this.workout = workout;
    }
}
