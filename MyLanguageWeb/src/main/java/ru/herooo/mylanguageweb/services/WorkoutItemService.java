package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguagedb.repositories.WorkoutItemCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemMapping;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

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

    public List<WorkoutItem> findListWithAnswer(Long workoutId, Long roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findListWithAnswer(workoutId, roundNumber);
    }

    public List<WorkoutItem> findListWithoutAnswer(Long workoutId) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findListWithoutAnswer(workoutId);
    }

    public WorkoutItem add(WorkoutItem workoutItem) {
        workoutItem.setCorrect(false);
        workoutItem.setWordTitleAnswer(null);
        workoutItem.setDateOfSetAnswer(null);
        if (workoutItem.getRoundNumber() <= 0) {
            workoutItem.setRoundNumber(1);
        }

        return WORKOUT_ITEM_CRUD_REPOSITORY.save(workoutItem);
    }

    public WorkoutItem edit(WorkoutItem oldWorkoutItem, WorkoutItemRequestDTO dto) {
        WorkoutItem workoutItem = WORKOUT_ITEM_MAPPING.mapToWorkoutItem(oldWorkoutItem, dto);
        return edit(workoutItem);
    }

    public WorkoutItem edit(WorkoutItem workoutItem) {
        workoutItem.setDateOfSetAnswer(LocalDateTime.now());
        return WORKOUT_ITEM_CRUD_REPOSITORY.save(workoutItem);
    }

    public WorkoutItem find(long id) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public WorkoutItem findRandomWithoutAnswer(Long workoutId, Long roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY
                .findRandomWithoutAnswer(workoutId, roundNumber).orElse(null);
    }

    public WorkoutItem findFirstWithoutAnswer(Long workoutId, Integer roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.findFirstWithoutAnswer(workoutId, roundNumber).orElse(null);
    }

    public long countWithAnswer(Long workoutId, Long roundNumber) {
        return WORKOUT_ITEM_CRUD_REPOSITORY.countWithAnswer(workoutId, roundNumber).orElse(0L);
    }
}
