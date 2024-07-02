package ru.herooo.mylanguageweb.dto.entity.color;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Color;
import ru.herooo.mylanguageweb.dto.entity.color.response.ColorResponseDTO;

@Service
public class ColorMapping {
    public ColorResponseDTO mapToResponseDTO(Color color) {
        ColorResponseDTO dto = new ColorResponseDTO();
        dto.setId(color.getId());
        dto.setTitle(color.getTitle());
        dto.setHexCode(color.getHexCode());

        return dto;
    }
}
