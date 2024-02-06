package ru.herooo.mylanguageweb.dto.workoutitem;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.workout.WorkoutResponseDTO;

import java.time.LocalDateTime;

public class WorkoutItemResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonProperty("word_title_request")
    private String wordTitleRequest;

    @JsonProperty("word_title_response")
    private String wordTitleResponse;

    @JsonProperty("is_correct")
    private boolean isCorrect;

    @JsonProperty("round_number")
    private int roundNumber;

    @JsonProperty("date_of_set_response")
    private LocalDateTime dateOfSetResponse;

    @JsonProperty("workout")
    private WorkoutResponseDTO workout;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWordTitleRequest() {
        return wordTitleRequest;
    }

    public void setWordTitleRequest(String wordTitleRequest) {
        this.wordTitleRequest = wordTitleRequest;
    }

    public String getWordTitleResponse() {
        return wordTitleResponse;
    }

    public void setWordTitleResponse(String wordTitleResponse) {
        this.wordTitleResponse = wordTitleResponse;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public LocalDateTime getDateOfSetResponse() {
        return dateOfSetResponse;
    }

    public void setDateOfSetResponse(LocalDateTime dateOfSetResponse) {
        this.dateOfSetResponse = dateOfSetResponse;
    }

    public WorkoutResponseDTO getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutResponseDTO workout) {
        this.workout = workout;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(int roundNumber) {
        this.roundNumber = roundNumber;
    }
}
