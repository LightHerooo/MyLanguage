package ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TranslatedWord {
    @JsonProperty("text")
    private String title;

    @JsonProperty("syn")
    private TranslatedSynonym[] synonyms;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TranslatedSynonym[] getSynonyms() {
        return synonyms;
    }

    public void setSynonyms(TranslatedSynonym[] synonyms) {
        this.synonyms = synonyms;
    }
}
