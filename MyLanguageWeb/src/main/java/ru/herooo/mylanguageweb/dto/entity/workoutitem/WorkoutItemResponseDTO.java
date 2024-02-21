package ru.herooo.mylanguageweb.dto.entity.workoutitem;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutResponseDTO;

import java.time.LocalDateTime;

public class WorkoutItemResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonProperty("word_title_question")
    private String wordTitleQuestion;

    @JsonProperty("word_title_answer")
    private String wordTitleAnswer;

    @JsonProperty("is_correct")
    private boolean isCorrect;

    @JsonProperty("round_number")
    private int roundNumber;

    @JsonProperty("date_of_set_answer")
    private LocalDateTime dateOfSetAnswer;

    @JsonProperty("workout")
    private WorkoutResponseDTO workout;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWordTitleQuestion() {
        return wordTitleQuestion;
    }

    public void setWordTitleQuestion(String wordTitleQuestion) {
        this.wordTitleQuestion = wordTitleQuestion;
    }

    public String getWordTitleAnswer() {
        return wordTitleAnswer;
    }

    public void setWordTitleAnswer(String wordTitleAnswer) {
        this.wordTitleAnswer = wordTitleAnswer;
    }

    public boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(boolean correct) {
        isCorrect = correct;
    }

    public LocalDateTime getDateOfSetAnswer() {
        return dateOfSetAnswer;
    }

    public void setDateOfSetAnswer(LocalDateTime dateOfSetAnswer) {
        this.dateOfSetAnswer = dateOfSetAnswer;
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
