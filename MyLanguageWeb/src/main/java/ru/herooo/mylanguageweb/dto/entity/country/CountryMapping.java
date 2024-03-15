package ru.herooo.mylanguageweb.dto.entity.country;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Country;

@Service
public class CountryMapping {
    public CountryResponseDTO mapToResponseDTO(Country country) {
        CountryResponseDTO dto = new CountryResponseDTO();
        dto.setId(country.getId());
        dto.setTitle(country.getTitle());
        dto.setCode(country.getCode());

        return dto;
    }
}
