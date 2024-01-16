package ru.herooo.mylanguagedb.repositories.wordincollection;

import ru.herooo.mylanguagedb.entities.WordInCollection;

public interface WordInCollectionRepository<T> {

    void detach(WordInCollection wordInCollection);
}
