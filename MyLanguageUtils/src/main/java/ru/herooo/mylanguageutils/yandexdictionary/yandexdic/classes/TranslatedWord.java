package ru.herooo.mylanguageutils.yandexdictionary.yandexdic.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TranslatedWord {
    @JsonProperty("text")
    private String title;

    @JsonProperty("syn")
    private List<TranslatedSynonym> synonyms;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<TranslatedSynonym> getSynonyms() {
        return synonyms;
    }

    public void setSynonyms(List<TranslatedSynonym> synonyms) {
        this.synonyms = synonyms;
    }
}
