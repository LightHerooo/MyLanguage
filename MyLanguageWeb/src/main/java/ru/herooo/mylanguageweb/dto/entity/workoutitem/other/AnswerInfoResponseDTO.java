package ru.herooo.mylanguageweb.dto.entity.workoutitem.other;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.response.WorkoutItemResponseDTO;

import java.util.List;

public class AnswerInfoResponseDTO {

    @JsonProperty("workout_item")
    private WorkoutItemResponseDTO workoutItem;

    @JsonProperty("message")
    private String message;

    @JsonProperty("is_correct")
    private boolean isCorrect;

    @JsonProperty("possible_answers")
    private List<String> possibleAnswers;


    public WorkoutItemResponseDTO getWorkoutItem() {
        return workoutItem;
    }

    public void setWorkoutItem(WorkoutItemResponseDTO workoutItem) {
        this.workoutItem = workoutItem;
    }

    public boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(boolean correct) {
        isCorrect = correct;
    }

    public List<String> getPossibleAnswers() {
        return possibleAnswers;
    }

    public void setPossibleAnswers(List<String> possibleAnswers) {
        this.possibleAnswers = possibleAnswers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
