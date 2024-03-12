package ru.herooo.mylanguagedb.repositories.workouttype;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutType;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutTypeCrudRepository extends CrudRepository<WorkoutType, Long>, WorkoutTypeRepository<WorkoutType> {
    Optional<WorkoutType> findByCode(String code);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_workout_types_after_filter(:title)")
    List<WorkoutType> findAllAfterFilter(@Param("title") String title);
}
