package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WorkoutItem;

@Repository
public interface WorkoutItemCrudRepository extends CrudRepository<WorkoutItem, Long> {

}
