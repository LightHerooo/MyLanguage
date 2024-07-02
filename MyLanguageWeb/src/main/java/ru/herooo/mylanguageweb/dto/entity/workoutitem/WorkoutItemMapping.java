package ru.herooo.mylanguageweb.dto.entity.workoutitem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.response.WorkoutItemResponseDTO;

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
        dto.setQuestion(workoutItem.getQuestion());
        dto.setAnswer(workoutItem.getAnswer());
        dto.setIsCorrect(workoutItem.isCorrect());
        dto.setDateOfSetAnswer(workoutItem.getDateOfSetAnswer());
        dto.setRoundNumber(workoutItem.getRoundNumber());

        if (workoutItem.getWorkout() != null) {
            WorkoutResponseDTO workout = WORKOUT_MAPPING.mapToResponseDTO(workoutItem.getWorkout());
            dto.setWorkout(workout);
        }

        return dto;
    }
}
