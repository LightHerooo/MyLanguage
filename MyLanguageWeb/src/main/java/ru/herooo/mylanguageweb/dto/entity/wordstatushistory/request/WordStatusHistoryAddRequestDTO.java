package ru.herooo.mylanguageweb.dto.entity.wordstatushistory.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;

public class WordStatusHistoryAddRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("word_id")
    private long wordId;

    @JsonProperty("word_status_code")
    private String wordStatusCode;

    @JsonProperty("auth_key")
    private String authKey;

    public long getWordId() {
        return wordId;
    }

    public void setWordId(long wordId) {
        this.wordId = wordId;
    }

    public String getWordStatusCode() {
        return wordStatusCode;
    }

    public void setWordStatusCode(String wordStatusCode) {
        this.wordStatusCode = wordStatusCode;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
