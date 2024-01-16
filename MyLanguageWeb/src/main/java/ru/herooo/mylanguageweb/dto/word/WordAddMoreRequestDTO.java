package ru.herooo.mylanguageweb.dto.word;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WordAddMoreRequestDTO {
    @JsonProperty("auth_code")
    public String authCode;

    @JsonProperty("words")
    public WordRequestDTO[] words;

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public WordRequestDTO[] getWords() {
        return words;
    }

    public void setWords(WordRequestDTO[] words) {
        this.words = words;
    }
}
