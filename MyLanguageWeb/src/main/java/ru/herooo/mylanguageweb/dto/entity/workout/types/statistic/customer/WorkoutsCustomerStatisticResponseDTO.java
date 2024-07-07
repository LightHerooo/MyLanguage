package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.customer;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

public class WorkoutsCustomerStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_milliseconds")
    private long numberOfMilliseconds;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_workouts")
    private long numberOfWorkouts;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_rounds")
    private long numberOfRounds;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    @JsonProperty("workout_answers_statistic")
    private WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic;

    public long getNumberOfMilliseconds() {
        return numberOfMilliseconds;
    }

    public void setNumberOfMilliseconds(long numberOfMilliseconds) {
        this.numberOfMilliseconds = numberOfMilliseconds;
    }

    public long getNumberOfWorkouts() {
        return numberOfWorkouts;
    }

    public void setNumberOfWorkouts(long numberOfWorkouts) {
        this.numberOfWorkouts = numberOfWorkouts;
    }

    public long getNumberOfRounds() {
        return numberOfRounds;
    }

    public void setNumberOfRounds(long numberOfRounds) {
        this.numberOfRounds = numberOfRounds;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }

    public WorkoutAnswersStatisticResponseDTO getWorkoutAnswersStatistic() {
        return workoutAnswersStatistic;
    }

    public void setWorkoutAnswersStatistic(WorkoutAnswersStatisticResponseDTO workoutAnswersStatistic) {
        this.workoutAnswersStatistic = workoutAnswersStatistic;
    }
}
