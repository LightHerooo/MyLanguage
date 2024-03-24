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
    @Query(value =
            "FROM WorkoutType wt " +
            "ORDER BY wt.isActive DESC, wt.title")
    List<WorkoutType> findAll();

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_workout_types(:title)")
    List<WorkoutType> findAll(@Param("title") String title);

    Optional<WorkoutType> findByCode(String code);
}
