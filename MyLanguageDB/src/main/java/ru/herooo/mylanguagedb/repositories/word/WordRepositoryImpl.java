package ru.herooo.mylanguagedb.repositories.word;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.Word;

import java.time.LocalDate;
import java.util.Optional;

public class WordRepositoryImpl implements WordRepository<Word> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Long> count(LocalDate localDate) {
        return em.createQuery("SELECT COUNT(*) " +
                                 "FROM Word w " +
                                 "WHERE CAST(w.dateOfCreate AS DATE) = :local_date", Long.class)
                .setParameter("local_date", localDate)
                .getSingleResult()
                .describeConstable();
    }
}
