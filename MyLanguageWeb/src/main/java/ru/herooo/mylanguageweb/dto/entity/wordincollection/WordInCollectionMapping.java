package ru.herooo.mylanguageweb.dto.entity.wordincollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.word.WordCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.request.WordInCollectionAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.response.WordInCollectionResponseDTO;

@Service
public class WordInCollectionMapping {
    private final WordCrudRepository WORD_CRUD_REPOSITORY;
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;
    private final WordMapping WORD_MAPPING;

    @Autowired
    public WordInCollectionMapping(WordCrudRepository wordCrudRepository,
                                   CustomerCollectionCrudRepository customerCollectionCrudRepository,

                                   CustomerCollectionMapping customerCollectionMapping,
                                   WordMapping wordMapping) {
        this.WORD_CRUD_REPOSITORY = wordCrudRepository;
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.WORD_MAPPING = wordMapping;
    }

    public WordInCollectionResponseDTO mapToResponseDTO(WordInCollection wordInCollection) {
        WordInCollectionResponseDTO dto = new WordInCollectionResponseDTO();
        dto.setId(wordInCollection.getId());
        dto.setDateOfAdditional(wordInCollection.getDateOfAdditional());

        if (wordInCollection.getCustomerCollection() != null) {
            dto.setCustomerCollection(CUSTOMER_COLLECTION_MAPPING
                    .mapToResponseDTO(wordInCollection.getCustomerCollection()));
        }
        if (wordInCollection.getWord() != null) {
            dto.setWord(WORD_MAPPING.mapToResponseDTO(wordInCollection.getWord()));
        }

        return dto;
    }

    public WordInCollection mapToWordInCollection(WordInCollectionAddRequestDTO dto) {
        WordInCollection wordInCollection = new WordInCollection();

        long wordId = dto.getWordId();
        if (wordId != 0) {
            Word word = WORD_CRUD_REPOSITORY.findById(wordId).orElse(null);
            wordInCollection.setWord(word);
        }

        long customerCollectionId = dto.getCustomerCollectionId();
        if (customerCollectionId != 0) {
            CustomerCollection collection = CUSTOMER_COLLECTION_CRUD_REPOSITORY.findById(customerCollectionId)
                    .orElse(null);
            wordInCollection.setCustomerCollection(collection);
        }

        return wordInCollection;
    }
}
