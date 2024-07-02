package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;

import java.util.List;

@Service
public class WorkoutTypeService {

    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;
    @Autowired
    public WorkoutTypeService(WorkoutTypeCrudRepository workoutTypeCrudRepository) {
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;
    }

    public List<WorkoutType> findAll(String title, Boolean isPrepared, Boolean isActive, Long numberOfItems,
                                     Long lastWorkoutTypeIdOnPreviousPage) {
        return WORKOUT_TYPE_CRUD_REPOSITORY.findAll(title, isPrepared, isActive, numberOfItems, lastWorkoutTypeIdOnPreviousPage);
    }

    public List<WorkoutType> findAll() {
        return WORKOUT_TYPE_CRUD_REPOSITORY.findAll(null, true, null, 0L, 0L);
    }



    public WorkoutType find(String code) {
        return WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }

    public WorkoutType find(WorkoutTypes workoutTypes) {
        return WORKOUT_TYPE_CRUD_REPOSITORY.find(workoutTypes).orElse(null);
    }

    public WorkoutType editIsActive(WorkoutType workoutType, boolean isActive) {
        WorkoutType result = null;
        if (workoutType != null) {
            workoutType.setActive(isActive);
            result = WORKOUT_TYPE_CRUD_REPOSITORY.save(workoutType);
        }

        return result;
    }



    public void switchWorkoutTypes(boolean isActive) {
        WORKOUT_TYPE_CRUD_REPOSITORY.switchWorkoutTypes(isActive);
    }

}
