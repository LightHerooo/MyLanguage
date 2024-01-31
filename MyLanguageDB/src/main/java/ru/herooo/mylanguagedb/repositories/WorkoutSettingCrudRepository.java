package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WorkoutSetting;
import ru.herooo.mylanguagedb.entities.WorkoutType;

@Repository
public interface WorkoutSettingCrudRepository extends CrudRepository<WorkoutSetting, Long> {
    WorkoutSetting findById(long id);
    WorkoutSetting findByCustomerAndWorkoutType(Customer customer, WorkoutType workoutType);
}
