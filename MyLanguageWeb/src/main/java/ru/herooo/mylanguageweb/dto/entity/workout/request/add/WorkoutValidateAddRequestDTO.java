package ru.herooo.mylanguageweb.dto.entity.workout.request.add;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;

public class WorkoutValidateAddRequestDTO {
    @JsonProperty("workout_type_code")
    private String workoutTypeCode;

    @JsonProperty("lang_in_code")
    private String langInCode;

    @JsonProperty("lang_out_code")
    private String langOutCode;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("auth_key")
    private String authKey;

    public String getWorkoutTypeCode() {
        return workoutTypeCode;
    }

    public void setWorkoutTypeCode(String workoutTypeCode) {
        this.workoutTypeCode = workoutTypeCode;
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

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
