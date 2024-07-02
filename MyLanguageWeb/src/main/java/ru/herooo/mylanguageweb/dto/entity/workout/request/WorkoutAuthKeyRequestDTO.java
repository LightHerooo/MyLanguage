package ru.herooo.mylanguageweb.dto.entity.workout.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkoutAuthKeyRequestDTO {
    @JsonProperty("workout_auth_key")
    private String workoutAuthKey;

    @JsonProperty("customer_auth_key")
    private String customerAuthKey;

    public String getWorkoutAuthKey() {
        return workoutAuthKey;
    }

    public void setWorkoutAuthKey(String workoutAuthKey) {
        this.workoutAuthKey = workoutAuthKey;
    }

    public String getCustomerAuthKey() {
        return customerAuthKey;
    }

    public void setCustomerAuthKey(String customerAuthKey) {
        this.customerAuthKey = customerAuthKey;
    }
}
