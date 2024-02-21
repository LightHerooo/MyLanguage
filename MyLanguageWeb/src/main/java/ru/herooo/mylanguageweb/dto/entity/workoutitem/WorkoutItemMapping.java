package ru.herooo.mylanguageweb.dto.entity.workoutitem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutResponseDTO;

@Service
public class WorkoutItemMapping {

    private final WorkoutMapping WORKOUT_MAPPING;

    @Autowired
    public WorkoutItemMapping(WorkoutMapping workoutMapping) {

        this.WORKOUT_MAPPING = workoutMapping;
    }

    public WorkoutItemResponseDTO mapToResponseDTO(WorkoutItem workoutItem) {
        WorkoutItemResponseDTO dto = new WorkoutItemResponseDTO();
        dto.setId(workoutItem.getId());
        dto.setWordTitleQuestion(workoutItem.getWordTitleQuestion());
        dto.setWordTitleAnswer(workoutItem.getWordTitleAnswer());
        dto.setIsCorrect(workoutItem.isCorrect());
        dto.setDateOfSetAnswer(workoutItem.getDateOfSetAnswer());
        dto.setRoundNumber(workoutItem.getRoundNumber());

        if (workoutItem.getWorkout() != null) {
            WorkoutResponseDTO workout = WORKOUT_MAPPING.mapToResponseDTO(workoutItem.getWorkout());
            dto.setWorkout(workout);
        }

        return dto;
    }

    // Маппинг для изменения (все вносимые поля могут быть изменены)
    public WorkoutItem mapToWorkoutItem(WorkoutItem oldWorkoutItem, WorkoutItemRequestDTO dto) {
        // Не проводим дополнительных проверок, т.к. поле может быть NULL
        oldWorkoutItem.setWordTitleAnswer(dto.getWordTitleAnswer());

        return oldWorkoutItem;
    }
}
