package ru.herooo.mylanguageweb.dto.entity.wordstatushistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.word.response.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.response.WordStatusResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.response.WordStatusHistoryResponseDTO;

@Service
public class WordStatusHistoryMapping {

    private final WordMapping WORD_MAPPING;
    private final WordStatusMapping WORD_STATUS_MAPPING;

    @Autowired
    public WordStatusHistoryMapping(WordMapping wordMapping,
                                    WordStatusMapping wordStatusMapping) {
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
}
