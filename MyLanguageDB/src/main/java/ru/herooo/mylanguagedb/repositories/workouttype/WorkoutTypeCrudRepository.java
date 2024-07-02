package ru.herooo.mylanguagedb.repositories.workouttype;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutType;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutTypeCrudRepository extends CrudRepository<WorkoutType, Long>, WorkoutTypeRepository<WorkoutType> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_workout_types(:title, :is_prepared, :is_active, :number_of_items, " +
                ":last_workout_type_id_on_previous_page)")
    List<WorkoutType> findAll(@Param("title") String title,
                              @Param("is_prepared") Boolean isPrepared,
                              @Param("is_active") Boolean isActive,
                              @Param("number_of_items") Long numberOfItems,
                              @Param("last_workout_type_id_on_previous_page") Long lastWorkoutTypeIdOnPreviousPage);



    Optional<WorkoutType> findByCode(String code);



    @Procedure("switch_workout_types")
    void switchWorkoutTypes(Boolean isActive);
}
