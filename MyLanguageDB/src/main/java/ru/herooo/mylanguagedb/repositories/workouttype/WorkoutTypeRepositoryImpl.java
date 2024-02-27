package ru.herooo.mylanguagedb.repositories.workouttype;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.WorkoutType;

import java.util.Optional;

public class WorkoutTypeRepositoryImpl implements WorkoutTypeRepository<WorkoutType> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<WorkoutType> find(WorkoutTypes workoutTypes) {
        return em.createQuery("FROM WorkoutType wt " +
                                 "WHERE wt.id = :workoutTypeId", WorkoutType.class)
                .setParameter("workoutTypeId", workoutTypes.ID)
                .getResultStream()
                .findAny();
    }
}
