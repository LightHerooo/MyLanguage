package ru.herooo.mylanguageutils.yandexdictionary.dicresult;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes.TranslatedSynonym;
import ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes.TranslatedWord;
import ru.herooo.mylanguageutils.yandexdictionary.dicresult.classes.TranslatedGroup;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DicResult {
    @JsonProperty("def")
    private TranslatedGroup[] translatedGroups;

    public TranslatedGroup[] getTranslatedGroups() {
        return translatedGroups;
    }

    public void setTranslatedGroups(TranslatedGroup[] translatedGroups) {
        this.translatedGroups = translatedGroups;
    }

    public TranslatedWord findTranslatedWordByTitle(String title) {
        final StringUtils STRING_UTILS = new StringUtils();

        TranslatedWord foundWord = null;
        if (translatedGroups != null) {
            for (TranslatedGroup group: translatedGroups) {
                if (group.getTranslatedWords() != null) {
                    for (TranslatedWord word: group.getTranslatedWords()) {
                        if (STRING_UTILS.getClearString(word.getTitle())
                                .equals(STRING_UTILS.getClearString(title))) {
                            foundWord = word;
                            break;
                        }

                        if (word.getSynonyms() != null) {
                            for (TranslatedSynonym synonym: word.getSynonyms()) {
                                if (STRING_UTILS.getClearString(synonym.getTitle())
                                        .equals(STRING_UTILS.getClearString(title))) {
                                    foundWord = word;
                                    break;
                                }
                            }
                        }

                        if (foundWord != null) break;
                    }

                    if (foundWord != null) break;
                }
            }
        }

        return foundWord;
    }

    public List<String> getAllTranslates() {
        List<String> translates = new ArrayList<>();

        if (translatedGroups != null) {
            for (TranslatedGroup group: translatedGroups) {
                if (group.getTranslatedWords() != null) {
                    for (TranslatedWord word: group.getTranslatedWords()) {
                        translates.add(word.getTitle());

                        if (word.getSynonyms() != null) {
                            for (TranslatedSynonym synonym: word.getSynonyms()) {
                                translates.add(synonym.getTitle());
                            }
                        }
                    }
                }
            }
        }

        return translates;
    }
}
