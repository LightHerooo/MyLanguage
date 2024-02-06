package ru.herooo.mylanguageweb.dto.workoutitem;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutItemRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;
    @JsonProperty("word_title_response")
    private String wordTitleResponse;

    @JsonProperty("auth_code")
    private String authCode;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWordTitleResponse() {
        return wordTitleResponse;
    }

    public void setWordTitleResponse(String wordTitleResponse) {
        this.wordTitleResponse = wordTitleResponse;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }
}
