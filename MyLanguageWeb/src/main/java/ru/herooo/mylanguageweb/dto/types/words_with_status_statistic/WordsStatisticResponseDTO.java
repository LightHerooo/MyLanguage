package ru.herooo.mylanguageweb.dto.types.words_with_status_statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusResponseDTO;

public class WordsStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("word_status")
    private WordStatusResponseDTO wordStatus;

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }

    public WordStatusResponseDTO getWordStatus() {
        return wordStatus;
    }

    public void setWordStatus(WordStatusResponseDTO wordStatus) {
        this.wordStatus = wordStatus;
    }
}
