package ru.herooo.mylanguageweb.dto.partofspeech;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;

@Service
public class PartOfSpeechMapping {
    public PartOfSpeechResponseDTO mapToResponseDTO(PartOfSpeech partOfSpeech) {
        PartOfSpeechResponseDTO dto = new PartOfSpeechResponseDTO();
        dto.setId(partOfSpeech.getId());
        dto.setTitle(partOfSpeech.getTitle());
        dto.setCode(partOfSpeech.getCode());
        dto.setColorHexCode(partOfSpeech.getColorHexCode());
        return dto;
    }
}
