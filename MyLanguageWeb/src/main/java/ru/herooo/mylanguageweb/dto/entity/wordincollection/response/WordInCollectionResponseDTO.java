package ru.herooo.mylanguageweb.dto.entity.wordincollection.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.customercollection.response.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.word.response.WordResponseDTO;

import java.time.LocalDateTime;

public class WordInCollectionResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("date_of_additional")
    private LocalDateTime dateOfAdditional;

    @JsonProperty("customer_collection")
    private CustomerCollectionResponseDTO customerCollection;

    @JsonProperty("word")
    private WordResponseDTO word;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getDateOfAdditional() {
        return dateOfAdditional;
    }

    public void setDateOfAdditional(LocalDateTime dateOfAdditional) {
        this.dateOfAdditional = dateOfAdditional;
    }

    public CustomerCollectionResponseDTO getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollectionResponseDTO customerCollection) {
        this.customerCollection = customerCollection;
    }

    public WordResponseDTO getWord() {
        return word;
    }

    public void setWord(WordResponseDTO word) {
        this.word = word;
    }
}
