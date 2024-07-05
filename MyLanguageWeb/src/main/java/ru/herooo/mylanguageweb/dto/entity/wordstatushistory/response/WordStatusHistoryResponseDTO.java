package ru.herooo.mylanguageweb.dto.entity.wordstatushistory.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.word.response.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.response.WordStatusResponseDTO;

import java.time.LocalDateTime;

public class WordStatusHistoryResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("date_of_start")
    private LocalDateTime dateOfStart;

    @JsonProperty("date_of_end")
    private LocalDateTime dateOfEnd;

    @JsonProperty("word")
    private WordResponseDTO word;

    @JsonProperty("word_status")
    private WordStatusResponseDTO wordStatus;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getDateOfStart() {
        return dateOfStart;
    }

    public void setDateOfStart(LocalDateTime dateOfStart) {
        this.dateOfStart = dateOfStart;
    }

    public LocalDateTime getDateOfEnd() {
        return dateOfEnd;
    }

    public void setDateOfEnd(LocalDateTime dateOfEnd) {
        this.dateOfEnd = dateOfEnd;
    }

    public WordResponseDTO getWord() {
        return word;
    }

    public void setWord(WordResponseDTO word) {
        this.word = word;
    }

    public WordStatusResponseDTO getWordStatus() {
        return wordStatus;
    }

    public void setWordStatus(WordStatusResponseDTO wordStatus) {
        this.wordStatus = wordStatus;
    }
}
