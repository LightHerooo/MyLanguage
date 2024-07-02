package ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.workout_type;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteWorkoutType;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.response.WorkoutTypeResponseDTO;

@Service
public class FavouriteWorkoutTypeMapping {
    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;

    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;

    @Autowired
    public FavouriteWorkoutTypeMapping(WorkoutTypeCrudRepository workoutTypeCrudRepository,

                                       WorkoutTypeMapping workoutTypeMapping) {
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;

        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
    }

    public FavouriteWorkoutTypeResponseDTO mapToResponse(FavouriteWorkoutType favouriteWorkoutType) {
        FavouriteWorkoutTypeResponseDTO dto = new FavouriteWorkoutTypeResponseDTO();

        String workoutTypeCode = favouriteWorkoutType.getWorkoutTypeCode().orElse(null);
        if (workoutTypeCode != null) {
            WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(workoutTypeCode).orElse(null);
            if (workoutType != null) {
                WorkoutTypeResponseDTO workoutTypeResponseDTO = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
                dto.setWorkoutType(workoutTypeResponseDTO);
            }
        }

        dto.setNumberOfWorkouts(favouriteWorkoutType.getNumberOfWorkouts().orElse(0L));

        return dto;
    }
}
