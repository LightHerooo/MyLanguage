package ru.herooo.mylanguageweb.dto.types.words_with_status_statistic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatusCrudRepository;
import ru.herooo.mylanguagedb.types.WordsStatistic;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusResponseDTO;

@Service
public class WordsStatisticMapping {

    private final WordStatusCrudRepository WORD_STATUS_CRUD_REPOSITORY;
    private final WordStatusMapping WORD_STATUS_MAPPING;

    @Autowired
    public WordsStatisticMapping(WordStatusCrudRepository wordStatusCrudRepository,
                                 WordStatusMapping wordStatusMapping) {
        this.WORD_STATUS_CRUD_REPOSITORY = wordStatusCrudRepository;
        this.WORD_STATUS_MAPPING = wordStatusMapping;
    }

    public WordsStatisticResponseDTO mapToResponse(WordsStatistic wordsStatistic) {
        WordsStatisticResponseDTO dto = new WordsStatisticResponseDTO();

        dto.setNumberOfWords(wordsStatistic.getNumberOfWords().orElse(0L));

        String wordStatusCode = wordsStatistic.getWordStatusCode().orElse(null);
        if (wordStatusCode != null) {
            WordStatus wordStatus = WORD_STATUS_CRUD_REPOSITORY.findByCode(wordStatusCode).orElse(null);
            if (wordStatus != null) {
                WordStatusResponseDTO wordStatusResponse = WORD_STATUS_MAPPING.mapToResponseDTO(wordStatus);
                dto.setWordStatus(wordStatusResponse);
            }
        }

        return dto;
    }
}
