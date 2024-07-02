package ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.lang;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteLang;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

@Service
public class FavouriteLangMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;

    private final LangMapping LANG_MAPPING;

    @Autowired
    public FavouriteLangMapping(LangCrudRepository langCrudRepository,

                                LangMapping langMapping) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;

        this.LANG_MAPPING = langMapping;
    }

    public FavouriteLangResponseDTO mapToResponse(FavouriteLang favouriteLang) {
        FavouriteLangResponseDTO dto = new FavouriteLangResponseDTO();

        String langCode = favouriteLang.getLangCode().orElse(null);
        if (langCode != null) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            if (lang != null) {
                LangResponseDTO langResponseDTO = LANG_MAPPING.mapToResponseDTO(lang);
                dto.setLang(langResponseDTO);
            }
        }

        dto.setNumberOfWorkouts(favouriteLang.getNumberOfWorkouts().orElse(0L));

        return dto;
    }
}
