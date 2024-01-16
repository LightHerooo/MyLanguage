package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.wordincollection.WordInCollectionCrudRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WordInCollectionService {
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;

    @Autowired
    public WordInCollectionService(WordInCollectionCrudRepository wordInCollectionCrudRepository) {
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;
    }

    public List<WordInCollection> findAll() {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findAll();
    }

    public List<WordInCollection> findWordsInCollectionAfterFilter(String title, String langCode, String partOfSpeechCode,
           String customerCollectionKey) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findWordsInCollectionAfterFilter(title, langCode, partOfSpeechCode, customerCollectionKey);
    }

    public List<WordInCollection> findWordsInCollectionAfterFilterWithPagination(String title, String langCode,
        String partOfSpeechCode, String customerCollectionKey, Long numberOfWords,
         Long lastWordInCollectionIdOnPreviousPage) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findWordsInCollectionAfterFilterWithPagination(title, langCode,
                partOfSpeechCode, customerCollectionKey, numberOfWords, lastWordInCollectionIdOnPreviousPage);
    }

    public WordInCollection add(Word word, CustomerCollection customerCollection) {
        WordInCollection wordInCollection = null;
        if (word != null && customerCollection != null) {
            wordInCollection = new WordInCollection();
            wordInCollection.setWord(word);
            wordInCollection.setCustomerCollection(customerCollection);
            wordInCollection.setDateOfAdditional(LocalDateTime.now());
            WORD_IN_COLLECTION_CRUD_REPOSITORY.save(wordInCollection);
        }

        return wordInCollection;
    }

    public WordInCollection findByWordAndCustomerCollection(Word word, CustomerCollection customerCollection) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findByWordAndCustomerCollection(word, customerCollection);
    }

    public WordInCollection findById(long id) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findById(id);
    }

    public void deleteById(long id) {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.deleteById(id);
    }

    public void deleteInactiveWordsInCollection() {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.deleteInactiveWordsInCollections();
    }

    public long countByCustomerCollectionKey(String collectionKey) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.countByCustomerCollectionKey(collectionKey);
    }
}
