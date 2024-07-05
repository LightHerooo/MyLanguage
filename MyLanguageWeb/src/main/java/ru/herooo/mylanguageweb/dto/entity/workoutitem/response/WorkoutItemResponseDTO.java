package ru.herooo.mylanguageweb.dto.entity.workoutitem.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;

import java.time.LocalDateTime;

public class WorkoutItemResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonProperty("question")
    private String question;

    @JsonProperty("answer")
    private String answer;

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

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
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
