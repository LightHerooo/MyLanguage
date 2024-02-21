package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguagedb.repositories.WordStatusHistoryCrudRepository;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatusCrudRepository;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.WordStatusHistoryMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.WordStatusHistoryRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WordStatusHistoryService {

    private final WordStatusHistoryCrudRepository WORD_STATUS_HISTORY_CRUD_REPOSITORY;
    private final WordStatusCrudRepository WORD_STATUS_CRUD_REPOSITORY;

    private final WordStatusHistoryMapping WORD_STATUS_HISTORY_MAPPING;

    @Autowired
    public WordStatusHistoryService(WordStatusHistoryCrudRepository wordStatusHistoryCrudRepository,
                                    WordStatusCrudRepository wordStatusCrudRepository,
                                    WordStatusHistoryMapping wordStatusHistoryMapping) {
        this.WORD_STATUS_HISTORY_CRUD_REPOSITORY = wordStatusHistoryCrudRepository;
        this.WORD_STATUS_CRUD_REPOSITORY = wordStatusCrudRepository;

        this.WORD_STATUS_HISTORY_MAPPING = wordStatusHistoryMapping;
    }

    public List<WordStatusHistory> findList(Long wordId) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.findList(wordId);
    }

    public WordStatusHistory findCurrent(Long wordId) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.findCurrent(wordId);
    }

    public WordStatusHistory add(WordStatusHistoryRequestDTO dto) {
        WordStatusHistory status = WORD_STATUS_HISTORY_MAPPING.mapToWordStatusHistory(dto);
        status.setDateOfStart(LocalDateTime.now());

        WordStatus wordStatus = WORD_STATUS_CRUD_REPOSITORY.find(WordStatuses.NEW);
        status.setWordStatus(wordStatus);

        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.save(status);
    }

    public void addWordStatusToWord(Long wordId, String wordStatusCode) {
        WORD_STATUS_HISTORY_CRUD_REPOSITORY.addWordStatusToWord(wordId, wordStatusCode);
    }

    public WordStatusHistory getCurrentWordStatusHistoryToWord(Word word) {
        return WORD_STATUS_HISTORY_CRUD_REPOSITORY.getCurrentWordStatusHistoryToWord(word.getId());
    }

    public void addWordStatusToWordsWithoutStatus(String wordStatusCode) {
        WORD_STATUS_HISTORY_CRUD_REPOSITORY.addWordStatusToWordsWithoutStatus(wordStatusCode);
    }
}
