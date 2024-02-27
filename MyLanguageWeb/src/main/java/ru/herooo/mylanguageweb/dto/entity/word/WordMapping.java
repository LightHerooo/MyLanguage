package ru.herooo.mylanguageweb.dto.entity.word;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;

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

        if (word.getAuthor() != null) {
            CustomerResponseDTO customer = CUSTOMER_MAPPING.mapToResponseDTO(word.getAuthor());
            dto.setCustomer(customer);
        }

        return dto;
    }

    // Маппинг для добавления (все вносимые поля не могут быть изменены)
    public Word mapToWord(WordRequestDTO dto) {
        Word word = new Word();

        String title = dto.getTitle();
        if (STRING_UTILS.isNotStringVoid(title)) {
            title = STRING_UTILS.getClearString(title);
            word.setTitle(title);
        }

        String langCode = dto.getLangCode();
        if (STRING_UTILS.isNotStringVoid(langCode)) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            word.setLang(lang);
        }

        return mapToWord(word, dto);
    }

    // Маппинг для изменения (все вносимые поля могут быть изменены)
    public Word mapToWord(Word oldWord, WordRequestDTO dto) {
        long customerId = dto.getCustomerId();
        if (customerId > 0) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findById(customerId).orElse(null);
            if (customer != null) {
                oldWord.setAuthor(customer);
            }
        }

        return oldWord;
    }
}
