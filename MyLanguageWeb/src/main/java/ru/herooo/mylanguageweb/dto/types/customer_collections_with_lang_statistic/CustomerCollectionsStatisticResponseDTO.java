package ru.herooo.mylanguageweb.dto.types.customer_collections_with_lang_statistic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;

public class CustomerCollectionsStatisticResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_collections")
    private long numberOfCollections;

    @JsonProperty("lang")
    private LangResponseDTO lang;

    public long getNumberOfCollections() {
        return numberOfCollections;
    }

    public void setNumberOfCollections(long numberOfCollections) {
        this.numberOfCollections = numberOfCollections;
    }

    public LangResponseDTO getLang() {
        return lang;
    }

    public void setLang(LangResponseDTO lang) {
        this.lang = lang;
    }
}
