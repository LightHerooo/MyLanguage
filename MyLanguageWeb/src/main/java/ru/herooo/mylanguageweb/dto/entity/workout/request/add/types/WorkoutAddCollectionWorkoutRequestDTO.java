package ru.herooo.mylanguageweb.dto.entity.workout.request.add.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;

public class WorkoutAddCollectionWorkoutRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("customer_collection_id")
    private long customerCollectionId;

    @JsonProperty("lang_out_code")
    private String langOutCode;

    @JsonProperty("auth_key")
    private String authKey;

    public long getCustomerCollectionId() {
        return customerCollectionId;
    }

    public void setCustomerCollectionId(long customerCollectionId) {
        this.customerCollectionId = customerCollectionId;
    }

    public String getLangOutCode() {
        return langOutCode;
    }

    public void setLangOutCode(String langOutCode) {
        this.langOutCode = langOutCode;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
