package ru.herooo.mylanguageweb.dto.wordincollection;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

import java.io.Serializable;

public class WordInCollectionRequestDTO implements Serializable {

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("word_id")
    private long wordId;

    @JsonProperty("customer_collection_key")
    private String customerCollectionKey;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY, value = "auth_code")
    private String authCode;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public long getWordId() {
        return wordId;
    }

    public void setWordId(long wordId) {
        this.wordId = wordId;
    }

    public String getCustomerCollectionKey() {
        return customerCollectionKey;
    }

    public void setCustomerCollectionKey(String customerCollectionKey) {
        this.customerCollectionKey = customerCollectionKey;
    }
}
