package ru.herooo.mylanguageweb.dto.types.workout.workouts_customer_extra_statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeResponseDTO;
import ru.herooo.mylanguageweb.dto.types.workout.WorkoutAnswersStatistic;

public class WorkoutsCustomerExtraStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_milliseconds")
    private Long numberOfMilliseconds;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_workouts")
    private Long numberOfWorkouts;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_rounds")
    private Long numberOfRounds;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    @JsonProperty("workout_answers_statistic")
    private WorkoutAnswersStatistic workoutAnswersStatistic;

    @JsonProperty("favourite_lang_in")
    private LangResponseDTO favouriteLangIn;

    @JsonProperty("favourite_lang_out")
    private LangResponseDTO favouriteLangOut;

    @JsonProperty("favourite_workout_type")
    private WorkoutTypeResponseDTO favouriteWorkoutType;

    @JsonProperty("favourite_customer_collection")
    private CustomerCollectionResponseDTO favouriteCustomerCollection;

    public Long getNumberOfMilliseconds() {
        return numberOfMilliseconds;
    }

    public void setNumberOfMilliseconds(Long numberOfMilliseconds) {
        this.numberOfMilliseconds = numberOfMilliseconds;
    }

    public Long getNumberOfWorkouts() {
        return numberOfWorkouts;
    }

    public void setNumberOfWorkouts(Long numberOfWorkouts) {
        this.numberOfWorkouts = numberOfWorkouts;
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

    public LangResponseDTO getFavouriteLangIn() {
        return favouriteLangIn;
    }

    public void setFavouriteLangIn(LangResponseDTO favouriteLangIn) {
        this.favouriteLangIn = favouriteLangIn;
    }

    public LangResponseDTO getFavouriteLangOut() {
        return favouriteLangOut;
    }

    public void setFavouriteLangOut(LangResponseDTO favouriteLangOut) {
        this.favouriteLangOut = favouriteLangOut;
    }

    public WorkoutTypeResponseDTO getFavouriteWorkoutType() {
        return favouriteWorkoutType;
    }

    public void setFavouriteWorkoutType(WorkoutTypeResponseDTO favouriteWorkoutType) {
        this.favouriteWorkoutType = favouriteWorkoutType;
    }

    public CustomerCollectionResponseDTO getFavouriteCustomerCollection() {
        return favouriteCustomerCollection;
    }

    public void setFavouriteCustomerCollection(CustomerCollectionResponseDTO favouriteCustomerCollection) {
        this.favouriteCustomerCollection = favouriteCustomerCollection;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }
}
