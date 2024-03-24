package ru.herooo.mylanguageweb.dto.types.customer_collections_with_lang_statistic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguagedb.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;

@Service
public class CustomerCollectionsStatisticMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final LangMapping LANG_MAPPING;

    @Autowired
    public CustomerCollectionsStatisticMapping(LangCrudRepository langCrudRepository,
                                               LangMapping langMapping) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.LANG_MAPPING = langMapping;
    }

    public CustomerCollectionsStatisticResponseDTO mapToResponse(
            CustomerCollectionsStatistic customerCollectionsStatistic) {
        CustomerCollectionsStatisticResponseDTO dto = new CustomerCollectionsStatisticResponseDTO();

        dto.setNumberOfCollections(customerCollectionsStatistic.getNumberOfCollections().orElse(0L));

        String langCode = customerCollectionsStatistic.getLangCode().orElse(null);
        if (langCode != null) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            if (lang != null) {
                LangResponseDTO langResponse = LANG_MAPPING.mapToResponseDTO(lang);
                dto.setLang(langResponse);
            }
        }

        return dto;
    }
}
