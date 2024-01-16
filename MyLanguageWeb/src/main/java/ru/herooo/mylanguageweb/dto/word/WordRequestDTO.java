package ru.herooo.mylanguageweb.dto.word;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WordRequestDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;
    @JsonProperty("title")
    private String title;

    @JsonProperty("lang_code")
    private String langCode;

    @JsonProperty("part_of_speech_code")
    private String partOfSpeechCode;

    @JsonProperty("word_status_code")
    private String wordStatusCode;

    @JsonProperty("auth_code")
    private String authCode;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public String getPartOfSpeechCode() {
        return partOfSpeechCode;
    }

    public void setPartOfSpeechCode(String partOfSpeechCode) {
        this.partOfSpeechCode = partOfSpeechCode;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getWordStatusCode() {
        return wordStatusCode;
    }

    public void setWordStatusCode(String wordStatusCode) {
        this.wordStatusCode = wordStatusCode;
    }
}
