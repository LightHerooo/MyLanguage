package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguageweb.dto.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.workout.WorkoutRequestDTO;

import java.time.LocalDateTime;

@Service
public class WorkoutService {
    private final WorkoutCrudRepository WORKOUT_CRUD_REPOSITORY;

    private final WorkoutMapping WORKOUT_MAPPING;

    @Autowired
    public WorkoutService(WorkoutCrudRepository workoutCrudRepository,
                          WorkoutMapping workoutMapping) {
        this.WORKOUT_CRUD_REPOSITORY = workoutCrudRepository;

        this.WORKOUT_MAPPING = workoutMapping;
    }

    public Workout add(Workout workout) {
        workout.setDateOfStart(LocalDateTime.now());
        workout.setActive(true);

        return WORKOUT_CRUD_REPOSITORY.save(workout);
    }

    public Workout add(WorkoutRequestDTO dto) {
        Workout workout = WORKOUT_MAPPING.mapToWorkout(dto);
        return add(workout);
    }

    public void delete(Workout workout) {
        WORKOUT_CRUD_REPOSITORY.delete(workout);
    }

    public Workout findById(long id) {
        return WORKOUT_CRUD_REPOSITORY.findById(id);
    }

    public Workout findLastByCustomerAndWorkoutType(Customer customer, WorkoutType workoutType) {
        return WORKOUT_CRUD_REPOSITORY.findTop1ByCustomerAndWorkoutTypeOrderByDateOfStartDesc(customer, workoutType);
    }
}
