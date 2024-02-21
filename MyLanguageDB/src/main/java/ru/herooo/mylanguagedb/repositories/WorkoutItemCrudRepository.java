package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutItem;

import java.util.List;

@Repository
public interface WorkoutItemCrudRepository extends CrudRepository<WorkoutItem, Long> {
    WorkoutItem findById(long id);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_items_with_answer(:workout_id)")
    List<WorkoutItem> findListWithAnswer(@Param("workout_id") Long workoutId);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_items_with_answer(:workout_id, :round_number)")
    List<WorkoutItem> findListWithAnswer(@Param("workout_id") Long workoutId,
                                         @Param("round_number") Long roundNumber);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_items_without_answer(:workout_id)")
    List<WorkoutItem> findListWithoutAnswer(@Param("workout_id") Long workoutId);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_workout_items_with_answer(:workout_id, :round_number)")
    long countWithAnswer(@Param("workout_id") Long workoutId,
                         @Param("round_number") Long roundNumber);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_random_workout_item_without_answer(:workout_id, :round_number)")
    WorkoutItem findRandomWithoutAnswer(@Param("workout_id") Long workoutId,
                                        @Param("round_number") Long roundNumber);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_first_workout_item_without_answer(:workout_id, :round_number)")
    WorkoutItem findFirstWithoutAnswerByWorkoutIdAndRoundNumber(@Param("workout_id") Long workoutId,
                                                                @Param("round_number") Integer roundNumber);
}
