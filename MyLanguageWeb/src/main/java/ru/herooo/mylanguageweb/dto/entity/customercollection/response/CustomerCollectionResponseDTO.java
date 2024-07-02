package ru.herooo.mylanguageweb.dto.entity.customercollection.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

import java.time.LocalDateTime;

public class CustomerCollectionResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("date_of_create")
    private LocalDateTime dateOfCreate;

    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("is_active_for_author")
    private boolean isActiveForAuthor;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    @JsonProperty("lang")
    private LangResponseDTO lang;

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

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }

    public LangResponseDTO getLang() {
        return lang;
    }

    public void setLang(LangResponseDTO lang) {
        this.lang = lang;
    }

    public boolean getIsActiveForAuthor() {
        return isActiveForAuthor;
    }

    public void setIsActiveForAuthor(boolean activeForAuthor) {
        isActiveForAuthor = activeForAuthor;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }
}
