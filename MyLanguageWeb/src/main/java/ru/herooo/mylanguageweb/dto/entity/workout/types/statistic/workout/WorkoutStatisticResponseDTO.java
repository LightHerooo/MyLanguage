package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.workout;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

public class WorkoutStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_milliseconds")
    private long numberOfMilliseconds;

    @JsonProperty("number_of_rounds")
    private int numberOfRounds;

    @JsonProperty("workout")
    private WorkoutResponseDTO workout;

    @JsonProperty("workout_answers_statistic")
    private WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic;

    public long getNumberOfMilliseconds() {
        return numberOfMilliseconds;
    }

    public void setNumberOfMilliseconds(long numberOfMilliseconds) {
        this.numberOfMilliseconds = numberOfMilliseconds;
    }

    public int getNumberOfRounds() {
        return numberOfRounds;
    }

    public void setNumberOfRounds(int numberOfRounds) {
        this.numberOfRounds = numberOfRounds;
    }

    public WorkoutResponseDTO getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutResponseDTO workout) {
        this.workout = workout;
    }

    public WorkoutAnswersStatisticResponseDTO getWorkoutAnswersStatistic() {
        return workoutAnswersStatistic;
    }

    public void setWorkoutAnswersStatistic(WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic) {
        this.workoutAnswersStatistic = workoutAnswersStatistic;
    }
}
