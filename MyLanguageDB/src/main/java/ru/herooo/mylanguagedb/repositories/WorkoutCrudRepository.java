package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteCustomerCollection;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteLang;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutsCustomerStatistic;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutRoundStatistic;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutStatistic;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteWorkoutType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutCrudRepository extends CrudRepository<Workout, Long> {

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workouts_over(:workout_type_code, :customer_id, :date_of_end)")
    List<Workout> findAllOver(@Param("workout_type_code") String workoutTypeCode,
                              @Param("customer_id") Long customerId,
                              @Param("date_of_end") LocalDate dateOfEnd);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workouts_not_over(:workout_type_code, :customer_id)")
    List<Workout> findAllNotOver(@Param("workout_type_code") String workoutTypeCode,
                                 @Param("customer_id") Long customerId);


    Optional<Workout> findByAuthKey(@Param("auth_key") String authKey);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_last(:workout_type_code, :customer_id)")
    Optional<Workout> findLast(@Param("workout_type_code") String workoutTypeCode,
                               @Param("customer_id") Long customerId);



    @Query(nativeQuery = true, value =
            "SELECT ws.workout_id AS workoutId " +
            ", ws.number_of_milliseconds AS numberOfMilliseconds " +
            ", ws.number_of_rounds AS numberOfRounds " +
            ", ws.number_of_answers AS numberOfAnswers " +
            ", ws.number_of_true_answers AS numberOfTrueAnswers " +
            ", ws.number_of_false_answers AS numberOfFalseAnswers " +
            ", ws.success_rate AS successRate " +
            "FROM get_workout_statistic(:workout_type_code, :days, :workout_id) ws")
    Optional<WorkoutStatistic> findStatistic(@Param("workout_type_code") String workoutTypeCode,
                                             @Param("days") Integer days,
                                             @Param("workout_id") Long workoutId);

    @Query(nativeQuery = true, value =
            "SELECT wscs.customer_id AS customerId " +
            ", wscs.number_of_workouts AS numberOfWorkouts " +
            ", wscs.number_of_milliseconds AS numberOfMilliseconds " +
            ", wscs.number_of_rounds AS numberOfRounds " +
            ", wscs.number_of_answers AS numberOfAnswers " +
            ", wscs.number_of_true_answers AS numberOfTrueAnswers " +
            ", wscs.number_of_false_answers AS numberOfFalseAnswers " +
            ", wscs.success_rate AS successRate " +
            "FROM get_workouts_customer_statistic(:workout_type_code, :days, :customer_id) wscs")
    Optional<WorkoutsCustomerStatistic> findCustomerStatistic(@Param("workout_type_code") String workoutTypeCode,
                                                              @Param("days") Integer days,
                                                              @Param("customer_id") Long customerId);

    @Query(nativeQuery = true, value =
            "SELECT wrs.number_of_questions AS numberOfQuestions " +
            ", wrs.number_of_answers AS numberOfAnswers " +
            ", wrs.number_of_true_answers AS numberOfTrueAnswers " +
            ", wrs.number_of_false_answers AS numberOfFalseAnswers " +
            ", wrs.success_rate AS successRate " +
            "FROM get_workout_round_statistic(:workout_id, :round_number) wrs")
    Optional<WorkoutRoundStatistic> findRoundStatistic(@Param("workout_id") Long workoutId,
                                                       @Param("round_number") Integer roundNumber);

    @Query(nativeQuery = true, value =
            "SELECT fli.lang_code AS langCode" +
            ", fli.number_of_workouts AS numberOfWorkouts " +
            "FROM get_favourite_lang_in(:workout_type_code, :customer_id, :days) fli")
    Optional<FavouriteLang> findFavouriteLangIn(@Param("workout_type_code") String workoutTypeCode,
                                                @Param("customer_id") Long customerId,
                                                @Param("days") Integer days);

    @Query(nativeQuery = true, value =
            "SELECT flo.lang_code AS langCode" +
            ", flo.number_of_workouts AS numberOfWorkouts " +
            "FROM get_favourite_lang_out(:workout_type_code, :customer_id, :days) flo")
    Optional<FavouriteLang> findFavouriteLangOut(@Param("workout_type_code") String workoutTypeCode,
                                                 @Param("customer_id") Long customerId,
                                                 @Param("days") Integer days);

    @Query(nativeQuery = true, value =
            "SELECT fwt.workout_type_code AS workoutTypeCode" +
            ", fwt.number_of_workouts AS numberOfWorkouts " +
            "FROM get_favourite_workout_type(:customer_id, :days) fwt")
    Optional<FavouriteWorkoutType> findFavouriteWorkoutType(@Param("customer_id") Long customerId,
                                                            @Param("days") Integer days);

    @Query(nativeQuery = true, value =
            "SELECT fcc.customer_collection_id AS customerCollectionId" +
            ", fcc.number_of_workouts AS numberOfWorkouts " +
            "FROM get_favourite_customer_collection(:workout_type_code, :customer_id, :days) fcc")
    Optional<FavouriteCustomerCollection> findFavouriteCustomerCollection(@Param("workout_type_code") String workoutTypeCode,
                                                                          @Param("customer_id") Long customerId,
                                                                          @Param("days") Integer days);


    @Query(nativeQuery = true, value =
            "SELECT get_workout_max_date_of_end(:workout_type_code, :customer_id)")
    Optional<LocalDate> findMaxDateOfEnd(@Param("workout_type_code") String workoutTypeCode,
                                         @Param("customer_id") Long customerId);

    @Query(nativeQuery = true, value =
            "SELECT get_workout_next_date_of_end(:previous_date_of_end, :workout_type_code, :customer_id)")
    Optional<LocalDate> findNextDateOfEnd(@Param("previous_date_of_end") LocalDate previousDateOfEnd,
                                          @Param("workout_type_code") String workoutTypeCode,
                                          @Param("customer_id") Long customerId);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_workouts_not_over(:workout_type_code, :customer_id)")
    Optional<Long> countNotOver(@Param("workout_type_code") String workoutTypeCode,
                                @Param("customer_id") Long customerId);

    @Query(value =
            "SELECT MIN(wi.roundNumber) " +
            "FROM WorkoutItem wi " +
            "WHERE wi.workout.id = :workout_id " +
            "AND wi.dateOfSetAnswer IS NULL")
    Optional<Integer> findCurrentRoundNumber(@Param("workout_id") Long workoutId);

    @Query(value =
            "SELECT MAX(wi.roundNumber) " +
            "FROM WorkoutItem wi " +
            "WHERE wi.workout.id = :workout_id")
    Optional<Integer> findMaxRoundNumber(@Param("workout_id") Long workoutId);
}
