package ru.herooo.mylanguageweb.dto.entity.workout.request.edit;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;

public class WorkoutEditLongRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("value")
    private long value;

    @JsonProperty("workout_auth_key")
    private String workoutAuthKey;

    @JsonProperty("customer_auth_key")
    private String customerAuthKey;

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }

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
