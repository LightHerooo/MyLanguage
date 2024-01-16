package ru.herooo.mylanguageweb.dto.customercollection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CustomerCollectionAddMoreRequestDTO {
    @JsonProperty("auth_code")
    public String authCode;

    @JsonProperty("customer_collections")
    public CustomerCollectionRequestDTO[] customerCollections;

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public CustomerCollectionRequestDTO[] getCustomerCollections() {
        return customerCollections;
    }

    public void setCustomerCollections(CustomerCollectionRequestDTO[] customerCollections) {
        this.customerCollections = customerCollections;
    }
}
