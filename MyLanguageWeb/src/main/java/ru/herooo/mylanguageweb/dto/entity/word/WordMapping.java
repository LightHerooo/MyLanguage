package ru.herooo.mylanguageweb.dto.entity.word;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.word.request.WordAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.word.response.WordResponseDTO;

@Service
public class WordMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final LangMapping LANG_MAPPING;

    private final StringUtils STRING_UTILS;

    public WordMapping(LangCrudRepository langCrudRepository,
                       CustomerCrudRepository customerCrudRepository,

                       CustomerMapping customerMapping,
                       LangMapping langMapping,

                       StringUtils stringUtils) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.LANG_MAPPING = langMapping;

        this.STRING_UTILS = stringUtils;
    }

    public WordResponseDTO mapToResponseDTO(Word word) {
        WordResponseDTO dto = new WordResponseDTO();
        dto.setId(word.getId());
        dto.setTitle(word.getTitle());

        if (word.getLang() != null) {
            LangResponseDTO lang = LANG_MAPPING.mapToResponseDTO(word.getLang());
            dto.setLang(lang);
        }

        if (word.getCustomer() != null) {
            CustomerResponseDTO customer = CUSTOMER_MAPPING.mapToResponseDTO(word.getCustomer());
            dto.setCustomer(customer);
        }

        return dto;
    }

    public Word mapToWord(WordAddRequestDTO dto) {
        Word word = new Word();

        String title = dto.getTitle();
        if (!STRING_UTILS.isStringVoid(title)) {
            title = STRING_UTILS.createStrTrimToLower(title);
            word.setTitle(title);
        }

        String langCode = dto.getLangCode();
        if (!STRING_UTILS.isStringVoid(langCode)) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            word.setLang(lang);
        }

        String authKey = dto.getAuthKey();
        if (!STRING_UTILS.isStringVoid(authKey)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
            word.setCustomer(customer);
        }

        return word;
    }
}
