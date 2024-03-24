package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;
import ru.herooo.mylanguagedb.types.WorkoutStatistic;
import ru.herooo.mylanguagedb.types.WorkoutsCustomerExtraStatistic;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutCrudRepository extends CrudRepository<Workout, Long> {

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workouts(:customer_id, :workout_type_code, :date_of_end)")
    List<Workout> findAll(@Param("customer_id") Long customerId,
                          @Param("workout_type_code") String workoutTypeCode,
                          @Param("date_of_end") LocalDate dateOfEnd);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workouts_not_over(:customer_id, :workout_type_code, :is_active)")
    List<Workout> findListNotOver(@Param("customer_id") Long customerId,
                                  @Param("workout_type_code") String workoutTypeCode,
                                  @Param("is_active") Boolean isActive);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_workouts_not_over(:customer_id, :workout_type_code, :is_active)")
    long countNotOver(@Param("customer_id") Long customerId,
                      @Param("workout_type_code") String workoutTypeCode,
                      @Param("is_active") Boolean isActive);

    @Procedure(value = "repair_workouts_not_over")
    void repairNotOver(@Param("customer_id") Long customerId,
                       @Param("workout_type_code") String workoutTypeCode);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_last(:customer_id, :workout_type_code)")
    Optional<Workout> findLast(@Param("customer_id") Long customerId,
                     @Param("workout_type_code") String workoutTypeCode);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_workout_last_not_over_inactive(:customer_id)")
    Optional<Workout> findLastNotOverInactive(@Param("customer_id") Long customerId);

    @Query(nativeQuery = true, value =
            "SELECT get_workout_max_date_of_end(:customer_id, :workout_type_code)")
    Optional<LocalDate> findMaxDateOfEnd(@Param("customer_id") Long customerId,
                                         @Param("workout_type_code") String workoutTypeCode);

    @Query(nativeQuery = true, value =
            "SELECT get_workout_next_date_of_end(:customer_id, :workout_type_code, :date_of_end)")
    Optional<LocalDate> findNextDateOfEnd(@Param("customer_id") Long customerId,
                                          @Param("workout_type_code") String workoutTypeCode,
                                          @Param("date_of_end") LocalDate dateOfEnd);

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
            "SELECT wces.customer_id AS customerId, " +
                    "wces.number_of_milliseconds AS numberOfMilliseconds, " +
                    "wces.number_of_workouts AS numberOfWorkouts, " +
                    "wces.number_of_rounds AS numberOfRounds, " +
                    "wces.number_of_answers AS numberOfAnswers, " +
                    "wces.number_of_true_answers AS numberOfTrueAnswers, " +
                    "wces.number_of_false_answers AS numberOfFalseAnswers, " +
                    "wces.percent_of_true_answers AS percentOfTrueAnswers, " +
                    "wces.favourite_lang_in_code AS favouriteLangInCode, " +
                    "wces.favourite_lang_out_code AS favouriteLangOutCode, " +
                    "wces.favourite_workout_type_code AS favouriteWorkoutTypeCode, " +
                    "wces.favourite_customer_collection_id AS favouriteCustomerCollectionId " +
                    "FROM get_workouts_customer_extra_statistic(:customer_id, :workout_type_code, :days) wces")
    Optional<WorkoutsCustomerExtraStatistic> findCustomerExtraStatistic(@Param("customer_id") Long customerId,
                                                                        @Param("workout_type_code") String workoutTypeCode,
                                                                        @Param("days") Integer days);

    @Query(nativeQuery = true, value =
            "SELECT ws.workout_id AS workoutId, " +
                    "ws.number_of_milliseconds AS numberOfMilliseconds, " +
                    "ws.number_of_rounds AS numberOfRounds, " +
                    "ws.number_of_answers AS numberOfAnswers, " +
                    "ws.number_of_true_answers AS numberOfTrueAnswers, " +
                    "ws.number_of_false_answers AS numberOfFalseAnswers, " +
                    "ws.percent_of_true_answers AS percentOfTrueAnswers " +
            "FROM get_workout_statistic(:workout_id) ws")
    Optional<WorkoutStatistic> findStatistic(@Param("workout_id") Long workoutId);

    @Query(nativeQuery = true, value =
            "SELECT wrs.number_of_questions AS numberOfQuestions, " +
                    "wrs.number_of_true_answers AS numberOfTrueAnswers, " +
                    "wrs.number_of_false_answers AS numberOfFalseAnswers, " +
                    "wrs.number_of_questions_without_answer AS numberOfQuestionsWithoutAnswer " +
            "FROM get_workout_round_statistic(:workout_id, :round_number) wrs")
    Optional<WorkoutRoundStatistic> findRoundStatistic(@Param("workout_id") Long workoutId,
                                                       @Param("round_number") Long roundNumber);
}
