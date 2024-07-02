package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.round;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutRoundStatistic;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

@Service
public class WorkoutRoundStatisticMapping {
    public WorkoutRoundStatisticResponseDTO mapToResponse(WorkoutRoundStatistic workoutRoundStatistic) {
        WorkoutRoundStatisticResponseDTO dto = new WorkoutRoundStatisticResponseDTO();

        dto.setNumberOfQuestions(workoutRoundStatistic.getNumberOfQuestions().orElse(0L));

        // Заносим статистику по ответам в отдельный класс
        WorkoutAnswersStatisticResponseDTO workoutAnswersStatisticResponseDTO = new WorkoutAnswersStatisticResponseDTO();
        workoutAnswersStatisticResponseDTO.setNumberOfAnswers(workoutRoundStatistic.getNumberOfAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfTrueAnswers(
                workoutRoundStatistic.getNumberOfTrueAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfFalseAnswers(
                workoutRoundStatistic.getNumberOfFalseAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setSuccessRate(workoutRoundStatistic.getSuccessRate().orElse(0.00));

        dto.setWorkoutAnswersStatistic(workoutAnswersStatisticResponseDTO);

        return dto;
    }
}
