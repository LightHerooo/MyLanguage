package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutItem;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutItemCrudRepository extends CrudRepository<WorkoutItem, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_items(:workout_id, :is_question_with_answer, :round_number)")
    List<WorkoutItem> findAll(@Param("workout_id") Long workoutId,
                              @Param("is_question_with_answer") Boolean isQuestionWithAnswer,
                              @Param("round_number") Integer roundNumber);



    @Query(nativeQuery = true, value =
            "SELECT * " +
                    "FROM get_workout_item_first_without_answer(:workout_id, :round_number)")
    Optional<WorkoutItem> findFirstWithoutAnswer(@Param("workout_id") Long workoutId,
                                                 @Param("round_number") Integer roundNumber);

    @Query(nativeQuery = true, value =
            "SELECT * " +
                    "FROM get_workout_item_random_without_answer(:workout_id, :round_number)")
    Optional<WorkoutItem> findRandomWithoutAnswer(@Param("workout_id") Long workoutId,
                                                  @Param("round_number") Integer roundNumber);



    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_workout_items(:workout_id, :is_question_with_answer, :round_number)")
    Optional<Long> count(@Param("workout_id") Long workoutId,
                         @Param("is_question_with_answer") Boolean isQuestionWithAnswer,
                         @Param("round_number") Integer roundNumber);
}
