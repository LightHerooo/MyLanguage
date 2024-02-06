package ru.herooo.mylanguageweb.dto.workoutitem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguageweb.dto.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.workout.WorkoutResponseDTO;

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
        dto.setWordTitleRequest(workoutItem.getWordTitleRequest());
        dto.setWordTitleResponse(workoutItem.getWordTitleResponse());
        dto.setCorrect(workoutItem.isCorrect());
        dto.setDateOfSetResponse(workoutItem.getDateOfSetResponse());
        dto.setRoundNumber(workoutItem.getRoundNumber());

        if (workoutItem.getWorkout() != null) {
            WorkoutResponseDTO workout = WORKOUT_MAPPING.mapToResponseDTO(workoutItem.getWorkout());
            dto.setWorkout(workout);
        }

        return dto;
    }

    public WorkoutItem mapToWorkoutItem(WorkoutItem oldWorkoutItem, WorkoutItemRequestDTO dto) {
        // Не проводим дополнительных проверок, т.к. поле может быть NULL
        oldWorkoutItem.setWordTitleResponse(dto.getWordTitleResponse());

        return oldWorkoutItem;
    }
}
