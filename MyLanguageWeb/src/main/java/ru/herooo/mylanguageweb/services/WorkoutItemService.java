package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguagedb.repositories.WorkoutItemCrudRepository;
import ru.herooo.mylanguageweb.dto.workoutitem.WorkoutItemMapping;

@Service
public class WorkoutItemService {
    private final WorkoutItemCrudRepository WORKOUT_ITEM_CRUD_REPOSITORY;

    private final WorkoutItemMapping WORKOUT_ITEM_MAPPING;

    @Autowired
    public WorkoutItemService(WorkoutItemCrudRepository workoutItemCrudRepository,
                              WorkoutItemMapping workoutItemMapping) {
        this.WORKOUT_ITEM_CRUD_REPOSITORY = workoutItemCrudRepository;
        this.WORKOUT_ITEM_MAPPING = workoutItemMapping;
    }

    public WorkoutItem add(WorkoutItem workoutItem) {
        workoutItem.setCorrect(false);
        workoutItem.setWordTitleResponse(null);
        workoutItem.setDateOfSetResponse(null);
        workoutItem.setRoundNumber(1);
        return WORKOUT_ITEM_CRUD_REPOSITORY.save(workoutItem);
    }
}
