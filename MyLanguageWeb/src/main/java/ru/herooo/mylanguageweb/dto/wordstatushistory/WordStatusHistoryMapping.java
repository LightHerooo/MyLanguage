package ru.herooo.mylanguageweb.dto.wordstatushistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguageweb.dto.word.WordMapping;
import ru.herooo.mylanguageweb.dto.word.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.wordstatus.WordStatusMapping;
import ru.herooo.mylanguageweb.dto.wordstatus.WordStatusResponseDTO;
import ru.herooo.mylanguageweb.services.WordService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Service
public class WordStatusHistoryMapping {

    private final WordService WORD_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;

    private final WordMapping WORD_MAPPING;
    private final WordStatusMapping WORD_STATUS_MAPPING;

    @Autowired
    public WordStatusHistoryMapping(WordService wordService,
                                    WordStatusService wordStatusService,
                                    WordMapping wordMapping,
                                    WordStatusMapping wordStatusMapping) {
        this.WORD_SERVICE = wordService;
        this.WORD_STATUS_SERVICE = wordStatusService;

        this.WORD_MAPPING = wordMapping;
        this.WORD_STATUS_MAPPING = wordStatusMapping;
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

        Word word = WORD_SERVICE.findById(dto.getWordId());
        wordStatusHistory.setWord(word);

        WordStatus wordStatus = WORD_STATUS_SERVICE.findByCode(dto.getWordStatusCode());
        wordStatusHistory.setWordStatus(wordStatus);

        return wordStatusHistory;
    }
}
