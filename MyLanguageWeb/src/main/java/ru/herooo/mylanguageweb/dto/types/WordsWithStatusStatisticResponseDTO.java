package ru.herooo.mylanguageweb.dto.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.types.WordsWithStatusStatistic;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WordsWithStatusStatisticResponseDTO {
    @JsonProperty("word_status_code")
    private String wordStatusCode;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    public WordsWithStatusStatisticResponseDTO(WordsWithStatusStatistic wordsWithStatusStatistic) {
        this.wordStatusCode = wordsWithStatusStatistic.getWordStatusCode().orElse(null);
        this.numberOfWords = wordsWithStatusStatistic.getNumberOfWords().orElse(0L);
    }

    public String getWordStatusCode() {
        return wordStatusCode;
    }

    public void setWordStatusCode(String wordStatusCode) {
        this.wordStatusCode = wordStatusCode;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }
}
