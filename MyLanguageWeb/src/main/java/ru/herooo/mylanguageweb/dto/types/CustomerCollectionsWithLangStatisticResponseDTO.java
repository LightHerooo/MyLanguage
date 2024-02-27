package ru.herooo.mylanguageweb.dto.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.types.CustomerCollectionsWithLangStatistic;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class CustomerCollectionsWithLangStatisticResponseDTO {
    @JsonProperty("lang_code")
    private String langCode;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_collections")
    private long numberOfCollections;

    public CustomerCollectionsWithLangStatisticResponseDTO(CustomerCollectionsWithLangStatistic statistic) {
        this.langCode = statistic.getLangCode().orElse(null);
        this.numberOfCollections = statistic.getNumberOfCollections().orElse(0L);
    }

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public long getNumberOfCollections() {
        return numberOfCollections;
    }

    public void setNumberOfCollections(long numberOfCollections) {
        this.numberOfCollections = numberOfCollections;
    }
}
