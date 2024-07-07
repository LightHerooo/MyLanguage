package ru.herooo.mylanguageweb.dto.entity.lang;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Country;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.CountryCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.country.CountryMapping;
import ru.herooo.mylanguageweb.dto.entity.country.response.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.request.LangAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.request.LangEditRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

@Service
public class LangMapping {
    private final CountryCrudRepository COUNTRY_CRUD_REPOSITORY;

    private final CountryMapping COUNTRY_MAPPING;
    private final StringUtils STRING_UTILS;

    @Autowired
    public LangMapping(CountryCrudRepository countryCrudRepository,

                       CountryMapping countryMapping,
                       StringUtils stringUtils) {
        this.COUNTRY_CRUD_REPOSITORY = countryCrudRepository;

        this.COUNTRY_MAPPING = countryMapping;
        this.STRING_UTILS = stringUtils;
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

    public Lang mapToLang(LangAddRequestDTO dto) {
        Lang lang = new Lang();

        lang.setTitle(dto.getTitle());
        lang.setCode(dto.getLangCode());
        lang.setActiveForIn(false);
        lang.setActiveForOut(false);

        String countryCode = dto.getCountryCode();
        if (!STRING_UTILS.isStringVoid(countryCode)) {
            Country country = COUNTRY_CRUD_REPOSITORY.findByCode(countryCode).orElse(null);
            lang.setCountry(country);
        }

        return lang;
    }

    public Lang mapToLang(Lang lang, LangEditRequestDTO dto) {
        String title = dto.getTitle();
        if (!STRING_UTILS.isStringVoid(title)) {
            title = STRING_UTILS.createStrTrimFirstUpper(title);
            lang.setTitle(title);
        }

        lang.setCode(dto.getLangCode());
        lang.setActiveForIn(dto.getIsActiveForIn());
        lang.setActiveForOut(dto.getIsActiveForOut());

        String countryCode = dto.getCountryCode();
        if (!STRING_UTILS.isStringVoid(countryCode)) {
            Country country = COUNTRY_CRUD_REPOSITORY.findByCode(countryCode).orElse(null);
            lang.setCountry(country);
        }

        return lang;
    }
}
