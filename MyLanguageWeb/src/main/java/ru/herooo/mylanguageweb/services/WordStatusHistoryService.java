package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguagedb.repositories.WordStatusHistoryCrudRepository;

import java.util.List;

@Service
public class WordStatusHistoryService {

    private final WordStatusHistoryCrudRepository WORD_STATUS_HISTORY_CRUD_REPOSITORY;

    @Autowired
    public WordStatusHistoryService(WordStatusHistoryCrudRepository wordStatusHistoryCrudRepository) {
        this.WORD_STATUS_HISTORY_CRUD_REPOSITORY = wordStatusHistoryCrudRepository;
    }

    public List<WordStatusHistory> findAllWordsWithCurrentStatus(String title,
                                                                 String langCode,
                                                                 String wordStatusCode,
                                                                 Long customerId,
                                                                 Long numberOfItems,
                                                                 Long lastWordStatusHistoryIdOnPreviousPage) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.findAllWordsWithCurrentStatus(title, langCode, wordStatusCode,
                customerId, numberOfItems, lastWordStatusHistoryIdOnPreviousPage);
    }

    public List<WordStatusHistory> findAllWordChangesHistory(Long wordId) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.findAllWordChangesHistory(wordId);
    }

    public WordStatusHistory findCurrent(Long wordId) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.findCurrent(wordId).orElse(null);
    }

    public void addWordStatusToWord(Long wordId, String wordStatusCode) {
        WORD_STATUS_HISTORY_CRUD_REPOSITORY.addWordStatusToWord(wordId, wordStatusCode);
    }
}
