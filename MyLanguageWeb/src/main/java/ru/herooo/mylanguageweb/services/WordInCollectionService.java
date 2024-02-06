package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.wordincollection.WordInCollectionCrudRepository;
import ru.herooo.mylanguageweb.dto.wordincollection.WordInCollectionMapping;
import ru.herooo.mylanguageweb.dto.wordincollection.WordInCollectionRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WordInCollectionService {
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;
    private final WordInCollectionMapping WORD_IN_COLLECTION_MAPPING;

    @Autowired
    public WordInCollectionService(WordInCollectionCrudRepository wordInCollectionCrudRepository,
                                   WordInCollectionMapping wordInCollectionMapping) {
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;

        this.WORD_IN_COLLECTION_MAPPING = wordInCollectionMapping;
    }

    public List<WordInCollection> findWordsInCollectionAfterFilter(String title, String langCode,
           String customerCollectionKey) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findWordsInCollectionAfterFilter(title, langCode, customerCollectionKey);
    }

    public List<WordInCollection> findWordsInCollectionAfterFilterWithPagination(String title,
                                                                                 String langCode,
                                                                                 String customerCollectionKey,
                                                                                 Long numberOfWords,
         Long lastWordInCollectionIdOnPreviousPage) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findWordsInCollectionAfterFilterWithPagination(
                title, langCode, customerCollectionKey, numberOfWords, lastWordInCollectionIdOnPreviousPage);
    }

    public WordInCollection add(WordInCollectionRequestDTO dto) {
        WordInCollection wordInCollection = WORD_IN_COLLECTION_MAPPING.mapToWordInCollection(dto);
        wordInCollection.setDateOfAdditional(LocalDateTime.now());

        return WORD_IN_COLLECTION_CRUD_REPOSITORY.save(wordInCollection);
    }

    public WordInCollection findByWordAndCustomerCollection(Word word, CustomerCollection customerCollection) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findByWordAndCustomerCollection(word, customerCollection);
    }

    public WordInCollection findById(long id) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findById(id);
    }

    public void delete(WordInCollection wordInCollection) {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.delete(wordInCollection);
    }

    public void deleteInactiveWordsInCollection() {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.deleteInactiveWordsInCollections();
    }

    public long countByCustomerCollectionKey(String collectionKey) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.countByCustomerCollectionKey(collectionKey);
    }
}
