package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.entities.WorkoutType;

@Repository
public interface WorkoutCrudRepository extends CrudRepository<Workout, Long> {
    Workout findById(long id);

    Workout findTop1ByCustomerAndWorkoutTypeOrderByDateOfStartDesc(Customer customer, WorkoutType workoutType);
}
