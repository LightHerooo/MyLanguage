package ru.herooo.mylanguageweb.dto.entity.wordstatushistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.word.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusResponseDTO;
import ru.herooo.mylanguageweb.services.WordService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Service
public class WordStatusHistoryMapping {

    private final WordService WORD_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;

    private final WordMapping WORD_MAPPING;
    private final WordStatusMapping WORD_STATUS_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public WordStatusHistoryMapping(WordService wordService,
                                    WordStatusService wordStatusService,
                                    WordMapping wordMapping,
                                    WordStatusMapping wordStatusMapping,
                                    StringUtils stringUtils) {
        this.WORD_SERVICE = wordService;
        this.WORD_STATUS_SERVICE = wordStatusService;

        this.WORD_MAPPING = wordMapping;
        this.WORD_STATUS_MAPPING = wordStatusMapping;

        this.STRING_UTILS = stringUtils;
    }

    public WordStatusHistoryResponseDTO mapToResponseDTO(WordStatusHistory wordStatusHistory) {
        WordStatusHistoryResponseDTO dto = new WordStatusHistoryResponseDTO();
        dto.setId(wordStatusHistory.getId());
        dto.setDateOfStart(wordStatusHistory.getDateOfStart());
        dto.setDateOfEnd(wordStatusHistory.getDateOfEnd());

        if (wordStatusHistory.getWordStatus() != null) {
            WordStatusResponseDTO wordStatus = WORD_STATUS_MAPPING.mapToResponseDTO(wordStatusHistory.getWordStatus());
            dto.setWordStatus(wordStatus);
        }

        if (wordStatusHistory.getWord() != null) {
            WordResponseDTO wordResponseDTO = WORD_MAPPING.mapToResponseDTO(wordStatusHistory.getWord());
            dto.setWord(wordResponseDTO);
        }

        return dto;
    }

    public WordStatusHistory mapToWordStatusHistory(WordStatusHistoryRequestDTO dto) {
        WordStatusHistory wordStatusHistory = new WordStatusHistory();

        long wordId = dto.getWordId();
        if (wordId != 0) {
            Word word = WORD_SERVICE.findById(wordId);
            wordStatusHistory.setWord(word);
        }

        String wordStatusCode = dto.getWordStatusCode();
        if (STRING_UTILS.isNotStringVoid(wordStatusCode)) {
            WordStatus wordStatus = WORD_STATUS_SERVICE.find(wordStatusCode);
            wordStatusHistory.setWordStatus(wordStatus);
        }

        return wordStatusHistory;
    }
}
