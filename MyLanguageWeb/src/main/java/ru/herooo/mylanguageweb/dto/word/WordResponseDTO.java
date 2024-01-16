package ru.herooo.mylanguageweb.dto.word;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.partofspeech.PartOfSpeechResponseDTO;

public class WordResponseDTO {

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("part_of_speech")
    private PartOfSpeechResponseDTO partOfSpeech;

    @JsonProperty("lang")
    private LangResponseDTO lang;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public PartOfSpeechResponseDTO getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(PartOfSpeechResponseDTO partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public LangResponseDTO getLang() {
        return lang;
    }

    public void setLang(LangResponseDTO lang) {
        this.lang = lang;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }
}
