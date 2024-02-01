package ru.herooo.mylanguageweb.dto.workoutsetting;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutSettingRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("workout_type_code")
    private String workoutTypeCode;

    @JsonProperty("lang_in_code")
    private String langInCode;

    @JsonProperty("lang_out_code")
    private String langOutCode;

    @JsonProperty("customer_collection_key")
    private String collectionKey;

    @JsonProperty("auth_code")
    private String authCode;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }

    public String getLangInCode() {
        return langInCode;
    }

    public void setLangInCode(String langInCode) {
        this.langInCode = langInCode;
    }

    public String getLangOutCode() {
        return langOutCode;
    }

    public void setLangOutCode(String langOutCode) {
        this.langOutCode = langOutCode;
    }

    public String getCollectionKey() {
        return collectionKey;
    }

    public void setCollectionKey(String collectionKey) {
        this.collectionKey = collectionKey;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getWorkoutTypeCode() {
        return workoutTypeCode;
    }

    public void setWorkoutTypeCode(String workoutTypeCode) {
        this.workoutTypeCode = workoutTypeCode;
    }
}