package ru.herooo.mylanguageweb.dto.entity.workoutitem.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;

public class WorkoutItemIdRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("workout_auth_key")
    private String workoutAuthKey;

    @JsonProperty("customer_auth_key")
    private String customerAuthKey;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
