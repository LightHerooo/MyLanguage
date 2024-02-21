package ru.herooo.mylanguageweb.dto.entity.workoutitem;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AnswerResultResponseDTO {

    @JsonProperty("workout_item")
    WorkoutItemResponseDTO workoutItem;

    @JsonProperty("is_correct")
    boolean isCorrect;

    @JsonProperty("possible_answers")
    List<String> possibleAnswers;

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
}
