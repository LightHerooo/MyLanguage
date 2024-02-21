package ru.herooo.mylanguageweb.dto.entity.workout;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeResponseDTO;

import java.time.LocalDateTime;

public class WorkoutResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("number_of_words")
    private long numberOfWords;

    @JsonProperty("date_of_start")
    private LocalDateTime dateOfStart;

    @JsonProperty("date_of_end")
    private LocalDateTime dateOfEnd;

    @JsonProperty("is_active")
    private boolean isActive;

    @JsonProperty("date_of_change_activity")
    private LocalDateTime dateOfChangeActivity;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("current_milliseconds")
    private long currentMilliseconds;

    @JsonProperty("customer")
    private CustomerResponseDTO customer;

    @JsonProperty("workout_type")
    private WorkoutTypeResponseDTO workoutType;

    @JsonProperty("lang_in")
    private LangResponseDTO langIn;

    @JsonProperty("lang_out")
    private LangResponseDTO langOut;

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

    public LocalDateTime getDateOfStart() {
        return dateOfStart;
    }

    public void setDateOfStart(LocalDateTime dateOfStart) {
        this.dateOfStart = dateOfStart;
    }

    public LocalDateTime getDateOfEnd() {
        return dateOfEnd;
    }

    public void setDateOfEnd(LocalDateTime dateOfEnd) {
        this.dateOfEnd = dateOfEnd;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean active) {
        isActive = active;
    }

    public CustomerResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResponseDTO customer) {
        this.customer = customer;
    }

    public WorkoutTypeResponseDTO getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(WorkoutTypeResponseDTO workoutType) {
        this.workoutType = workoutType;
    }

    public LangResponseDTO getLangIn() {
        return langIn;
    }

    public void setLangIn(LangResponseDTO langIn) {
        this.langIn = langIn;
    }

    public LangResponseDTO getLangOut() {
        return langOut;
    }

    public void setLangOut(LangResponseDTO langOut) {
        this.langOut = langOut;
    }

    public CustomerCollectionResponseDTO getCustomerCollection() {
        return customerCollection;
    }

    public void setCustomerCollection(CustomerCollectionResponseDTO customerCollection) {
        this.customerCollection = customerCollection;
    }

    public LocalDateTime getDateOfChangeActivity() {
        return dateOfChangeActivity;
    }

    public void setDateOfChangeActivity(LocalDateTime dateOfChangeActivity) {
        this.dateOfChangeActivity = dateOfChangeActivity;
    }

    public long getCurrentMilliseconds() {
        return currentMilliseconds;
    }

    public void setCurrentMilliseconds(long currentMilliseconds) {
        this.currentMilliseconds = currentMilliseconds;
    }
}
