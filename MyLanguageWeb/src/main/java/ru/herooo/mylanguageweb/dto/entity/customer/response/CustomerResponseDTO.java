package ru.herooo.mylanguageweb.dto.entity.customer.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.country.response.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customerrole.response.CustomerRoleResponseDTO;

import java.time.LocalDateTime;

public class CustomerResponseDTO {

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("nickname")
    private String nickname;

    @JsonProperty("path_to_avatar")
    private String pathToAvatar;

    @JsonProperty("description")
    private String description;

    @JsonProperty("role")
    private CustomerRoleResponseDTO role;

    @JsonProperty("date_of_create")
    private LocalDateTime dateOfCreate;

    @JsonProperty("date_of_last_visit")
    private LocalDateTime dateOfLastVisit;

    @JsonProperty("country")
    private CountryResponseDTO country;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public CustomerRoleResponseDTO getRole() {
        return role;
    }

    public void setRole(CustomerRoleResponseDTO role) {
        this.role = role;
    }

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }

    public LocalDateTime getDateOfLastVisit() {
        return dateOfLastVisit;
    }

    public void setDateOfLastVisit(LocalDateTime dateOfLastVisit) {
        this.dateOfLastVisit = dateOfLastVisit;
    }

    public CountryResponseDTO getCountry() {
        return country;
    }

    public void setCountry(CountryResponseDTO country) {
        this.country = country;
    }

    public String getPathToAvatar() {
        return pathToAvatar;
    }

    public void setPathToAvatar(String pathToAvatar) {
        this.pathToAvatar = pathToAvatar;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
