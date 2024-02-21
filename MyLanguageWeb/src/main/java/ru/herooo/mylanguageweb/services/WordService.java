package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.word.WordCrudRepository;
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

    // Получение слов после сортировки
    public List<Word> findAll(String title, String wordStatusCode, String langCode) {
        return WORD_CRUD_REPOSITORY.findAllAfterFilter(title, wordStatusCode, langCode);
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

    public List<Word> findAll(String title, String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.findAllWithCurrentStatus(title, wordStatusCode);
    }

    public long count(String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.count(wordStatusCode);
    }

    public long count(LocalDate date) {
        return WORD_CRUD_REPOSITORY.count(date);
    }

    public long count(Long customerId, String wordStatusCode) {
        return WORD_CRUD_REPOSITORY.count(customerId, wordStatusCode);
    }

    public Word findById(long id) {
        return WORD_CRUD_REPOSITORY.findById(id);
    }

    public Word findFirstByTitleIgnoreCaseAndLang(String title, Lang lang) {
        return WORD_CRUD_REPOSITORY.findFirstByTitleIgnoreCaseAndLang(title, lang);
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

    public Word edit(Word oldWord, WordRequestDTO dto) {
        Word word = WORD_MAPPING.mapToWord(oldWord, dto);
        return WORD_CRUD_REPOSITORY.save(word);
    }

    public void deleteAllUnclaimedWords() {
        WORD_CRUD_REPOSITORY.deleteAllUnclaimedWords();
    }
}
