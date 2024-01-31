package ru.herooo.mylanguageweb.dto.customercollection;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class CustomerCollectionRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @NotBlank(message = "Название не может быть пустым.")
    @Size(min = 3, max = 30, message = "Название должно быть от 3-х до 30-ти символов.")
    @JsonProperty("title")
    private String title;

    @JsonProperty("lang_code")
    private String langCode;

    @JsonProperty("key")
    private String key;

    @JsonProperty("auth_code")
    private String authCode;

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
        if (STRING_UTILS.isNotStringVoid(title)) {
            this.title = title.trim();
        }
    }

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
