package ru.herooo.mylanguagedb.repositories.wordincollection;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.WordInCollection;

public class WordInCollectionRepositoryImpl implements WordInCollectionRepository<WordInCollection>{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void detach(WordInCollection wordInCollection) {
        em.detach(wordInCollection);
    }
}
