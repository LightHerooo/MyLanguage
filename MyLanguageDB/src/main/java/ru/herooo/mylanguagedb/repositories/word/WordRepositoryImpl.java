package ru.herooo.mylanguagedb.repositories.word;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.Word;

import java.time.LocalDate;

public class WordRepositoryImpl implements WordRepository<Word> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public long count(LocalDate localDate) {
        return em.createQuery("SELECT COUNT(*) " +
                                 "FROM Word w " +
                                 "WHERE CAST(w.dateOfCreate AS DATE) = :local_date",
                        long.class)
                .setParameter("local_date", localDate)
                .getSingleResult();
    }
}
