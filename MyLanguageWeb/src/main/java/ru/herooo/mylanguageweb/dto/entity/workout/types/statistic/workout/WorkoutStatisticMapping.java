package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutStatistic;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

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
        dto.setNumberOfRounds(workoutStatistic.getNumberOfRounds().orElse(0));

        long workoutId = workoutStatistic.getWorkoutId().orElse(0L);
        if (workoutId != 0) {
            Workout workout = WORKOUT_CRUD_REPOSITORY.findById(workoutId).orElse(null);
            if (workout != null) {
                WorkoutResponseDTO workoutResponse = WORKOUT_MAPPING.mapToResponseDTO(workout);
                dto.setWorkout(workoutResponse);
            }
        }

        // Заносим статистику по ответам в отдельный класс
        WorkoutAnswersStatisticResponseDTO workoutAnswersStatisticResponseDTO = new WorkoutAnswersStatisticResponseDTO();
        workoutAnswersStatisticResponseDTO.setNumberOfAnswers(workoutStatistic.getNumberOfAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfTrueAnswers(workoutStatistic.getNumberOfTrueAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfFalseAnswers(workoutStatistic.getNumberOfFalseAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setSuccessRate(workoutStatistic.getSuccessRate().orElse(0.0));

        dto.setWorkoutAnswersStatistic(workoutAnswersStatisticResponseDTO);

        return dto;
    }
}
