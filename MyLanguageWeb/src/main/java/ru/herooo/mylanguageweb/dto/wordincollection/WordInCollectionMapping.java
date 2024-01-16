package ru.herooo.mylanguageweb.dto.wordincollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.word.WordMapping;

@Service
public class WordInCollectionMapping {

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;
    private final WordMapping WORD_MAPPING;

    @Autowired
    public WordInCollectionMapping(CustomerCollectionMapping customerCollectionMapping,
                                   WordMapping wordMapping) {
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

    public WordInCollectionRequestDTO mapToRequestDTO(WordInCollectionRequestDTO oldDTO,
                                                      WordInCollection wordInCollection) {
        oldDTO.setId(wordInCollection.getId());

        if (wordInCollection.getWord() != null) {
            oldDTO.setWordId(wordInCollection.getWord().getId());
        }

        if (wordInCollection.getCustomerCollection() != null) {
            oldDTO.setCustomerCollectionKey(wordInCollection.getCustomerCollection().getKey());
        }

        return oldDTO;
    }

    public WordInCollectionRequestDTO mapToRequestDTO(WordInCollection wordInCollection) {
        return mapToRequestDTO(new WordInCollectionRequestDTO(), wordInCollection);
    }
}
