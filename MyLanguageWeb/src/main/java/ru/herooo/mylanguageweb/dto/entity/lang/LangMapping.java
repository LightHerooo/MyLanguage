package ru.herooo.mylanguageweb.dto.entity.lang;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageweb.dto.entity.country.CountryMapping;
import ru.herooo.mylanguageweb.dto.entity.country.response.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

@Service
public class LangMapping {

    private final CountryMapping COUNTRY_MAPPING;

    @Autowired
    public LangMapping(CountryMapping countryMapping) {
        this.COUNTRY_MAPPING = countryMapping;
    }

    public LangResponseDTO mapToResponseDTO(Lang lang) {
        LangResponseDTO dto = new LangResponseDTO();
        dto.setId(lang.getId());
        dto.setTitle(lang.getTitle());
        dto.setCode(lang.getCode());
        dto.setIsActiveForIn(lang.isActiveForIn());
        dto.setIsActiveForOut(lang.isActiveForOut());

        if (lang.getCountry() != null) {
            CountryResponseDTO country = COUNTRY_MAPPING.mapToResponseDTO(lang.getCountry());
            dto.setCountry(country);
        }

        return dto;
    }
}
