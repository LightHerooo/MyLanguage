package ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TranslatedGroup {
    @JsonProperty("tr")
    private TranslatedWord[] translatedWords;

    public TranslatedWord[] getTranslatedWords() {
        return translatedWords;
    }

    public void setTranslatedWords(TranslatedWord[] translatedWords) {
        this.translatedWords = translatedWords;
    }
}
