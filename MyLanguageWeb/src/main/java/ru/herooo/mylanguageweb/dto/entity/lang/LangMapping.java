package ru.herooo.mylanguageweb.dto.entity.lang;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;

@Service
public class LangMapping {
    public LangResponseDTO mapToResponseDTO(Lang lang) {
        LangResponseDTO dto = new LangResponseDTO();
        dto.setId(lang.getId());
        dto.setTitle(lang.getTitle());
        dto.setCode(lang.getCode());
        dto.setCodeForTranslate(lang.getCodeForTranslate());
        dto.setIsActive(lang.isActive());

        return dto;
    }
}
