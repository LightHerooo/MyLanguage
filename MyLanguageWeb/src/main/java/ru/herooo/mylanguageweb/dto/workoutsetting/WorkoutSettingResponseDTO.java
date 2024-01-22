package ru.herooo.mylanguageweb.dto.workoutsetting;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.workouttype.WorkoutTypeResponseDTO;

public class WorkoutSettingResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("workout_type")
    private WorkoutTypeResponseDTO workoutType;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    @JsonProperty("lang_out")
    private LangResponseDTO langOut;

    @JsonProperty("lang_in")
    private LangResponseDTO langIn;

    @JsonProperty("customer_collection")
    private CustomerCollectionResponseDTO customerCollection;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }

    public WorkoutTypeResponseDTO getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutTypeResponseDTO workoutType) {
        this.workoutType = workoutType;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }

    public LangResponseDTO getLangOut() {
        return langOut;
    }

    public void setLangOut(LangResponseDTO langOut) {
        this.langOut = langOut;
    }

    public LangResponseDTO getLangIn() {
        return langIn;
    }

    public void setLangIn(LangResponseDTO langIn) {
        this.langIn = langIn;
    }

    public CustomerCollectionResponseDTO getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollectionResponseDTO customerCollection) {
        this.customerCollection = customerCollection;
    }
}
