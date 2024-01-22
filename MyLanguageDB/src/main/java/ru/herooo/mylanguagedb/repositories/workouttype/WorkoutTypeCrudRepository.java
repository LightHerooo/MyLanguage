package ru.herooo.mylanguagedb.repositories.workouttype;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutType;

import java.util.List;

@Repository
public interface WorkoutTypeCrudRepository extends CrudRepository<WorkoutType, Long>, WorkoutTypeRepository<WorkoutType> {
    List<WorkoutType> findAllByOrderByIdAscIsActive();
    WorkoutType findByCode(String code);
}
