package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutCrudRepository extends CrudRepository<Workout, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_not_over_workouts(:customer_id, :workout_type_code, :is_active)")
    List<Workout> findListNotOver(@Param("customer_id") Long customerId,
                                  @Param("workout_type_code") String workoutTypeCode,
                                  @Param("is_active") Boolean isActive);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_not_over_workouts(:customer_id, :workout_type_code, :is_active)")
    long countNotOver(@Param("customer_id") Long customerId,
                      @Param("workout_type_code") String workoutTypeCode,
                      @Param("is_active") Boolean isActive);

    @Procedure(value = "repair_not_over_workouts")
    void repairNotOverWorkouts(@Param("customer_id") Long customerId,
                               @Param("workout_type_code") String workoutTypeCode);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_last_workout(:customer_id, :workout_type_code)")
    Optional<Workout> findLast(@Param("customer_id") Long customerId,
                     @Param("workout_type_code") String workoutTypeCode);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_last_inactive_workout(:customer_id)")
    Optional<Workout> findLastInactive(@Param("customer_id") Long customerId);

    @Query(value =
            "SELECT MIN(wi.roundNumber) " +
            "FROM WorkoutItem wi " +
            "WHERE wi.workout.id = :workout_id " +
            "AND wi.dateOfSetAnswer IS NULL")
    Optional<Long> findCurrentRoundNumber(@Param("workout_id") Long workoutId);

    @Query(value =
            "SELECT MAX(wi.roundNumber) " +
            "FROM WorkoutItem wi " +
            "WHERE wi.workout.id = :workout_id")
    Optional<Long> findMaxRoundNumber(@Param("workout_id") Long workoutId);

    @Query(nativeQuery = true, value =
            "SELECT wrs.number_of_questions AS numberOfQuestions, " +
                    "wrs.number_of_true_answers AS numberOfTrueAnswers, " +
                    "wrs.number_of_false_answers AS numberOfFalseAnswers, " +
                    "wrs.number_of_questions_without_answer AS numberOfQuestionsWithoutAnswer " +
            "FROM get_workout_round_statistic(:workout_id, :round_number) wrs")
    Optional<WorkoutRoundStatistic> findRoundStatistic(@Param("workout_id") Long workoutId,
                                             @Param("round_number") Long roundNumber);
}
