package ru.herooo.mylanguageweb.dto.entity.customercollection.types.statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

public class CustomerCollectionsStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_collections")
    private Long numberOfCollections;

    @JsonProperty("lang")
    private LangResponseDTO lang;

    public Long getNumberOfCollections() {
        return numberOfCollections;
    }

    public void setNumberOfCollections(Long numberOfCollections) {
        this.numberOfCollections = numberOfCollections;
    }

    public LangResponseDTO getLang() {
        return lang;
    }

    public void setLang(LangResponseDTO lang) {
        this.lang = lang;
    }
}
