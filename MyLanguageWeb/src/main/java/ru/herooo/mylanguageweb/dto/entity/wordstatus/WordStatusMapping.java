package ru.herooo.mylanguageweb.dto.entity.wordstatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguageweb.dto.entity.color.ColorMapping;
import ru.herooo.mylanguageweb.dto.entity.color.ColorResponseDTO;

@Service
public class WordStatusMapping {

    private final ColorMapping COLOR_MAPPING;

    @Autowired
    public WordStatusMapping(ColorMapping colorMapping) {
        this.COLOR_MAPPING = colorMapping;
    }

    public WordStatusResponseDTO mapToResponseDTO(WordStatus wordStatus) {
        WordStatusResponseDTO dto = new WordStatusResponseDTO();
        dto.setId(wordStatus.getId());
        dto.setTitle(wordStatus.getTitle());
        dto.setCode(wordStatus.getCode());
        dto.setMessage(wordStatus.getMessage());

        if (wordStatus.getColor() != null) {
            ColorResponseDTO color = COLOR_MAPPING.mapToResponseDTO(wordStatus.getColor());
            dto.setColor(color);
        }

        return dto;
    }
}
