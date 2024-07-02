package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.round;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

public class WorkoutRoundStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_questions")
    private long numberOfQuestions;

    @JsonProperty("workout_answers_statistic")
    private WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic;

    public long getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(long numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public WorkoutAnswersStatisticResponseDTO getWorkoutAnswersStatistic() {
        return workoutAnswersStatistic;
    }

    public void setWorkoutAnswersStatistic(WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic) {
        this.workoutAnswersStatistic = workoutAnswersStatistic;
    }
}
