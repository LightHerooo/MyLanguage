package ru.herooo.mylanguageweb.dto.word;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.PartOfSpeechCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.partofspeech.PartOfSpeechMapping;
import ru.herooo.mylanguageweb.dto.partofspeech.PartOfSpeechResponseDTO;

@Service
public class WordMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final PartOfSpeechCrudRepository PART_OF_SPEECH_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final LangMapping LANG_MAPPING;
    private final PartOfSpeechMapping PART_OF_SPEECH_MAPPING;

    private final StringUtils STRING_UTILS;

    public WordMapping(LangCrudRepository langCrudRepository,
                       CustomerCrudRepository customerCrudRepository,
                       PartOfSpeechCrudRepository partOfSpeechCrudRepository,
                       CustomerMapping customerMapping,
                       LangMapping langMapping,
                       PartOfSpeechMapping partOfSpeechMapping,
                       StringUtils stringUtils) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.PART_OF_SPEECH_CRUD_REPOSITORY = partOfSpeechCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.LANG_MAPPING = langMapping;
        this.PART_OF_SPEECH_MAPPING = partOfSpeechMapping;

        this.STRING_UTILS = stringUtils;
    }

    public WordResponseDTO mapToResponseDTO(Word word) {
        WordResponseDTO dto = new WordResponseDTO();
        dto.setId(word.getId());
        dto.setTitle(word.getTitle());

        if (word.getPartOfSpeech() != null) {
            PartOfSpeechResponseDTO partOfSpeech = PART_OF_SPEECH_MAPPING.mapToResponseDTO(word.getPartOfSpeech());
            dto.setPartOfSpeech(partOfSpeech);
        }

        if (word.getLang() != null) {
            LangResponseDTO lang = LANG_MAPPING.mapToResponseDTO(word.getLang());
            dto.setLang(lang);
        }

        if (word.getAuthor() != null) {
            CustomerResponseDTO customer = CUSTOMER_MAPPING.mapToResponseDTO(word.getAuthor());
            dto.setCustomer(customer);
        }

        return dto;
    }

    public Word mapToWord(Word oldWord, WordRequestDTO dto) {
        String title = STRING_UTILS.getClearString(dto.getTitle());
        oldWord.setTitle(title);

        Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(dto.getAuthCode());
        oldWord.setAuthor(customer);

        Lang lang = LANG_CRUD_REPOSITORY.findByCode(dto.getLangCode());
        oldWord.setLang(lang);

        PartOfSpeech partOfSpeech = PART_OF_SPEECH_CRUD_REPOSITORY.findByCode(dto.getPartOfSpeechCode());
        oldWord.setPartOfSpeech(partOfSpeech);

        return oldWord;
    }

    public Word mapToWord(WordRequestDTO dto) {
        return mapToWord(new Word(), dto);
    }
}
