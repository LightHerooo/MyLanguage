package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WorkoutSetting;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.WorkoutSettingCrudRepository;

@Service
public class WorkoutSettingService {

    private final WorkoutSettingCrudRepository WORKOUT_SETTING_CRUD_REPOSITORY;

    @Autowired
    public WorkoutSettingService(WorkoutSettingCrudRepository workoutSettingCrudRepository) {
        this.WORKOUT_SETTING_CRUD_REPOSITORY = workoutSettingCrudRepository;
    }

    public WorkoutSetting findById(long id) {
        return WORKOUT_SETTING_CRUD_REPOSITORY.findById(id);
    }

    public WorkoutSetting findByCustomerAndWorkoutType(Customer customer, WorkoutType workoutType) {
        return WORKOUT_SETTING_CRUD_REPOSITORY.findByCustomerAndWorkoutType(customer, workoutType);
    }

    public WorkoutSetting save(WorkoutSetting workoutSetting) {
        return WORKOUT_SETTING_CRUD_REPOSITORY.save(workoutSetting);
    }
}
