package ru.herooo.mylanguagedb.repositories.workouttype;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutType;

import java.util.List;

@Repository
public interface WorkoutTypeCrudRepository extends CrudRepository<WorkoutType, Long>, WorkoutTypeRepository<WorkoutType> {

    WorkoutType findByCode(String code);

    @Query(value =
            "FROM WorkoutType wt " +
            "ORDER BY wt.id ASC, wt.isActive ASC")
    List<WorkoutType> findAll();
}
