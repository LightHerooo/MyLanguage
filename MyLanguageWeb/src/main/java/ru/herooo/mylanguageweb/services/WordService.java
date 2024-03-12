package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.word.WordCrudRepository;
import ru.herooo.mylanguagedb.types.WordsWithStatusStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.word.WordRequestDTO;

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

    public List<Word> findListRandom(String langCode, Long count) {
        return WORD_CRUD_REPOSITORY.findListRandom(langCode, count);
    }

    public List<Word> findListByTitle(String title, String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.findListByTitle(title, wordStatusCode);
    }

    // Получение слов после сортировки с пагинацией
    public List<Word> findAll(String title, String wordStatusCode,
                              String langCode, Long numberOfWordsOnPage,
                              Long lastWordIdOnPreviousPage) {
        return WORD_CRUD_REPOSITORY.findAllAfterFilterWithPagination(title, wordStatusCode,
                langCode, numberOfWordsOnPage, lastWordIdOnPreviousPage);
    }

    public List<Word> findAll(String title, String wordStatusCode,
                              String langCode, Long customerId,
                              Long numberOfWordsOnPage,
                              Long lastWordIdOnPreviousPage) {
        return WORD_CRUD_REPOSITORY.findAllCustomerWordsAfterFilterWithPagination(title, wordStatusCode,
                langCode, customerId, numberOfWordsOnPage, lastWordIdOnPreviousPage);
    }

    public List<WordsWithStatusStatistic> findWordsWithStatusStatistics() {
        return WORD_CRUD_REPOSITORY.findWordsWithStatusStatistics();
    }

    public List<WordsWithStatusStatistic> findWordsWithStatusStatistics(Long customerId) {
        return WORD_CRUD_REPOSITORY.findWordsWithStatusStatistics(customerId);
    }

    public long countByWordStatusCode(String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.count(null, wordStatusCode, null).orElse(0L);
    }

    public long countByLangCode(String langCode) {
        return WORD_CRUD_REPOSITORY.count(null, null, langCode).orElse(0L);
    }

    public long count(LocalDate date) {
        return WORD_CRUD_REPOSITORY.count(date).orElse(0L);
    }

    public Word findById(long id) {
        return WORD_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public Word findFirstByTitleIgnoreCaseAndLang(String title, Lang lang) {
        return WORD_CRUD_REPOSITORY.findFirstByTitleIgnoreCaseAndLang(title, lang).orElse(null);
    }

    public Word add(WordRequestDTO dto) {
        Word word = WORD_MAPPING.mapToWord(dto);
        return add(word);
    }

    public Word add(Word word) {
        String title = STRING_UTILS.getClearString(word.getTitle());
        word.setTitle(title);

        word.setDateOfCreate(LocalDateTime.now());
        return WORD_CRUD_REPOSITORY.save(word);
    }

    public void deleteAllUnclaimedWords() {
        WORD_CRUD_REPOSITORY.deleteAllUnclaimedWords();
    }
}
