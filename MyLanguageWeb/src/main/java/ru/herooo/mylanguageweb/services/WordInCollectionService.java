package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.WordInCollectionCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.WordInCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.request.WordInCollectionAddRequestDTO;

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

    public List<WordInCollection> findAll(Long customerCollectionId,
                                          String title,
                                          Long numberOfWords,
                                          Long lastWordInCollectionIdOnPreviousPage) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findAll(
                customerCollectionId, title, numberOfWords, lastWordInCollectionIdOnPreviousPage);
    }

    public List<WordInCollection> findAll(Long customerCollectionId, String title) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findAll(customerCollectionId, title, 0L, 0L);
    }



    public WordInCollection find(Word word, CustomerCollection customerCollection) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findByWordAndCustomerCollection(word, customerCollection)
                .orElse(null);
    }

    public WordInCollection find(Long id) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public WordInCollection add(WordInCollection wordInCollection) {
        wordInCollection.setDateOfAdditional(LocalDateTime.now());
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.save(wordInCollection);
    }

    public WordInCollection add(WordInCollectionAddRequestDTO dto) {
        WordInCollection wordInCollection = WORD_IN_COLLECTION_MAPPING.mapToWordInCollection(dto);
        return add(wordInCollection);
    }



    public Long count(Long customerCollectionId) {
        return WORD_IN_COLLECTION_CRUD_REPOSITORY.count(customerCollectionId).orElse(0L);
    }



    public void delete(WordInCollection wordInCollection) {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.delete(wordInCollection);
    }

    public void deleteAllByCustomerCollection(Long customerCollectionId, Long[] excludedIds) {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.deleteAllWordsToCustomerCollection(customerCollectionId, excludedIds);
    }

    public void deleteAllWithoutActiveStatus() {
        WORD_IN_COLLECTION_CRUD_REPOSITORY.deleteAllWithoutActiveStatus();
    }
}
