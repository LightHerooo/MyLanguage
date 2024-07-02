package ru.herooo.mylanguageweb.dto.entity.workouttype;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguageweb.dto.entity.workouttype.response.WorkoutTypeResponseDTO;

@Service
public class WorkoutTypeMapping {
    public WorkoutTypeResponseDTO mapToResponseDTO(WorkoutType workoutType) {
        WorkoutTypeResponseDTO dto = new WorkoutTypeResponseDTO();
        dto.setId(workoutType.getId());
        dto.setTitle(workoutType.getTitle());
        dto.setCode(workoutType.getCode());
        dto.setDescription(workoutType.getDescription());
        dto.setPathToImage(workoutType.getPathToImage());
        dto.setIsActive(workoutType.getActive());
        dto.setIsPrepared(workoutType.getPrepared());

        return dto;
    }
}
