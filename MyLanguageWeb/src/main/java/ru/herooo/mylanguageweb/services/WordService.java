package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.repositories.word.WordCrudRepository;
import ru.herooo.mylanguagedb.entities.word.types.WordsStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.word.request.WordAddRequestDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WordService {

    private final WordCrudRepository WORD_CRUD_REPOSITORY;

    private final WordMapping WORD_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public WordService(WordCrudRepository wordCrudRepository,

                       WordMapping wordMapping,

                       StringUtils stringUtils) {
        this.WORD_CRUD_REPOSITORY = wordCrudRepository;

        this.WORD_MAPPING = wordMapping;

        this.STRING_UTILS = stringUtils;
    }

    public List<Word> findAll(String title, String langCode, String wordStatusCode, Long customerId, Long numberOfWordsOnPage,
                              Long lastWordIdOnPreviousPage) {
        return WORD_CRUD_REPOSITORY.findAll(title, langCode, wordStatusCode, customerId, numberOfWordsOnPage,
                lastWordIdOnPreviousPage);
    }

    public List<Word> findAllRandom(String langCode, Long numberOfItems) {
        return WORD_CRUD_REPOSITORY.findAllRandom(langCode, numberOfItems);
    }

    public List<Word> findAllWithCurrentTitle(String title, String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.findAllWithCurrentTitle(title, wordStatusCode);
    }

    public List<WordsStatistic> findWordsStatistic() {
        return WORD_CRUD_REPOSITORY.findWordsStatistic();
    }

    public List<WordsStatistic> findWordsCustomerStatistic(Long customerId) {
        return WORD_CRUD_REPOSITORY.findWordsCustomerStatistic(customerId);
    }



    public Word find(long id) {
        return WORD_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public Word findFirstByTitleIgnoreCaseAndLang(String title, Lang lang) {
        return WORD_CRUD_REPOSITORY.findFirstByTitleIgnoreCaseAndLang(title, lang).orElse(null);
    }

    public Word add(WordAddRequestDTO dto) {
        Word word = WORD_MAPPING.mapToWord(dto);
        return add(word);
    }

    public Word add(Word word) {
        String title = STRING_UTILS.createStrTrimToLower(word.getTitle());
        word.setTitle(title);
        word.setDateOfCreate(LocalDateTime.now());

        return WORD_CRUD_REPOSITORY.save(word);
    }



    public long countByWordStatusCode(String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.count(null, null, wordStatusCode).orElse(0L);
    }

    public long countByLangCode(String langCode) {
        return WORD_CRUD_REPOSITORY.count(null, langCode, null).orElse(0L);
    }

    public long countByDateOfCreate(LocalDate dateOfCreate) {
        return WORD_CRUD_REPOSITORY.countByDateOfCreate(dateOfCreate).orElse(0L);
    }



    public void deleteAllUnclaimed() {
        WORD_CRUD_REPOSITORY.deleteAllUnclaimed();
    }
}
