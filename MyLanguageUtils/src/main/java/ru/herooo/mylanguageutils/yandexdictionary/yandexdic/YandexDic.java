package ru.herooo.mylanguageutils.yandexdictionary.yandexdic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.classes.TranslatedSynonym;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.classes.TranslatedWord;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.classes.TranslatedGroup;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YandexDic {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonProperty("def")
    private TranslatedGroup[] translatedGroups;

    public TranslatedGroup[] getTranslatedGroups() {
        return translatedGroups;
    }

    public void setTranslatedGroups(TranslatedGroup[] translatedGroups) {
        this.translatedGroups = translatedGroups;
    }

    public List<String> getAllTranslates() {
        List<String> translates = new ArrayList<>();

        if (translatedGroups != null) {
            for (TranslatedGroup group: translatedGroups) {
                if (group.getTranslatedWords() != null) {
                    for (TranslatedWord word: group.getTranslatedWords()) {
                        translates.add(STRING_UTILS.createStrTrimToLower(word.getTitle()));

                        if (word.getSynonyms() != null) {
                            for (TranslatedSynonym synonym: word.getSynonyms()) {
                                translates.add(STRING_UTILS.createStrTrimToLower(synonym.getTitle()));
                            }
                        }
                    }
                }
            }
        }

        return translates;
    }
}
