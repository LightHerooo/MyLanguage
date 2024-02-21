package ru.herooo.mylanguageweb.dto.entity.wordstatus;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatus;

@Service
public class WordStatusMapping {
    public WordStatusResponseDTO mapToResponseDTO(WordStatus wordStatus) {
        WordStatusResponseDTO dto = new WordStatusResponseDTO();
        dto.setId(wordStatus.getId());
        dto.setTitle(wordStatus.getTitle());
        dto.setCode(wordStatus.getCode());
        dto.setMessage(wordStatus.getMessage());
        dto.setColorHexCode(wordStatus.getColorHexCode());

        return dto;
    }
}
