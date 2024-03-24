package ru.herooo.mylanguageweb.dto.types.workout.workout_round_statistic;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;

@Service
public class WorkoutRoundStatisticMapping {
    public WorkoutRoundStatisticResponseDTO mapToResponse(WorkoutRoundStatistic workoutRoundStatistic) {
        WorkoutRoundStatisticResponseDTO dto = new WorkoutRoundStatisticResponseDTO();

        dto.setNumberOfQuestions(workoutRoundStatistic.getNumberOfQuestions().orElse(0L));
        dto.setNumberOfFalseAnswers(workoutRoundStatistic.getNumberOfFalseAnswers().orElse(0L));
        dto.setNumberOfTrueAnswers(workoutRoundStatistic.getNumberOfTrueAnswers().orElse(0L));
        dto.setNumberOfQuestionsWithoutAnswer(workoutRoundStatistic.getNumberOfQuestionsWithoutAnswer().orElse(0L));

        return dto;
    }
}
