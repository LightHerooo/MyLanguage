package ru.herooo.mylanguageweb.dto.types.workout.workout_statistic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguagedb.types.WorkoutStatistic;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.types.workout.WorkoutAnswersStatistic;

@Service
public class WorkoutStatisticMapping {

    private final WorkoutCrudRepository WORKOUT_CRUD_REPOSITORY;
    private final WorkoutMapping WORKOUT_MAPPING;

    @Autowired
    public WorkoutStatisticMapping(WorkoutCrudRepository workoutCrudRepository,
                                   WorkoutMapping workoutMapping) {
        this.WORKOUT_CRUD_REPOSITORY = workoutCrudRepository;
        this.WORKOUT_MAPPING = workoutMapping;
    }

    public WorkoutStatisticResponseDTO mapToResponse(WorkoutStatistic workoutStatistic) {
        WorkoutStatisticResponseDTO dto = new WorkoutStatisticResponseDTO();

        dto.setNumberOfMilliseconds(workoutStatistic.getNumberOfMilliseconds().orElse(0L));
        dto.setNumberOfRounds(workoutStatistic.getNumberOfRounds().orElse(0L));

        long workoutId = workoutStatistic.getWorkoutId().orElse(0L);
        if (workoutId != 0) {
            Workout workout = WORKOUT_CRUD_REPOSITORY.findById(workoutId).orElse(null);
            if (workout != null) {
                WorkoutResponseDTO workoutResponse = WORKOUT_MAPPING.mapToResponseDTO(workout);
                dto.setWorkout(workoutResponse);
            }
        }

        WorkoutAnswersStatistic workoutAnswersStatistic = new WorkoutAnswersStatistic(workoutStatistic);
        dto.setWorkoutAnswersStatistic(workoutAnswersStatistic);

        return dto;
    }
}
