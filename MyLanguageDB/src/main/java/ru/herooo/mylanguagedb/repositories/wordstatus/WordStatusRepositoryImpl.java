package ru.herooo.mylanguagedb.repositories.wordstatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.WordStatus;

public class WordStatusRepositoryImpl implements WordStatusRepository<WordStatus>{

    @PersistenceContext
    private EntityManager em;

    @Override
    public WordStatus find(WordStatuses wordStatuses) {
        return em.createQuery("from WordStatus ws where ws.id = :wordStatusId", WordStatus.class)
                .setParameter("wordStatusId", wordStatuses.ID).
                getResultStream().findAny().orElse(null);
    }
}
