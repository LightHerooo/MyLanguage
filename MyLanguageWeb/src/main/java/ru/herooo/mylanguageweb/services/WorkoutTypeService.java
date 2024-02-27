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

    public List<WorkoutType> findAll() {
        return WORKOUT_TYPE_CRUD_REPOSITORY.findAll();
    }

    public WorkoutType find(WorkoutTypes workoutTypes) {
        return WORKOUT_TYPE_CRUD_REPOSITORY.find(workoutTypes).orElse(null);
    }

    public WorkoutType find(String code) {
        return WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }
}
