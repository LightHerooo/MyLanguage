package ru.herooo.mylanguagedb.repositories.word;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.word.Word;

import java.time.LocalDate;
import java.util.Optional;

public class WordRepositoryImpl implements WordRepository<Word> {

    @PersistenceContext
    private EntityManager em;

    public Optional<Long> countByDateOfCreate(LocalDate dateOfCreate) {
        return em.createQuery("SELECT COUNT(*) " +
                                 "FROM Word w " +
                                 "WHERE CAST(w.dateOfCreate AS DATE) = :date_of_create", Long.class)
                .setParameter("date_of_create", dateOfCreate)
                .getSingleResult()
                .describeConstable();
    }
}
