package ru.herooo.mylanguagedb.repositories.workouttype;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.WorkoutType;

public class WorkoutTypeRepositoryImpl implements WorkoutTypeRepository<WorkoutType> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public WorkoutType find(WorkoutTypes workoutTypes) {
        return em.createQuery("FROM WorkoutType wt " +
                                 "WHERE wt.id = :workoutTypeId", WorkoutType.class)
                .setParameter("workoutTypeId", workoutTypes.ID)
                .getResultStream()
                .findAny()
                .orElse(null);
    }
}
