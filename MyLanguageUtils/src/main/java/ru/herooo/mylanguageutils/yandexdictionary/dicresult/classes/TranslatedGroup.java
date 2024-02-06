package ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TranslatedGroup {
    @JsonProperty("tr")
    private List<TranslatedWord> translatedWords;

    public List<TranslatedWord> getTranslatedWords() {
        return translatedWords;
    }

    public void setTranslatedWords(List<TranslatedWord> translatedWords) {
        this.translatedWords = translatedWords;
    }
}
