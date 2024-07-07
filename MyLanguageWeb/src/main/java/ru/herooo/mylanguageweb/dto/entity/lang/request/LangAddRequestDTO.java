package ru.herooo.mylanguageweb.dto.entity.lang.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import ru.herooo.mylanguageutils.StringUtils;

public class LangAddRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @NotBlank(message = "Код языка не может быть пустым")
    @JsonProperty("lang_code")
    private String langCode;

    @NotBlank(message = "Название не может быть пустым")
    @JsonProperty("title")
    private String title;

    @NotBlank(message = "Код страны не может быть пустым")
    @JsonProperty("country_code")
    private String countryCode;

    @JsonProperty("auth_key")
    private String authKey;


    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        if (!STRING_UTILS.isStringVoid(title)) {
            this.title = STRING_UTILS.createStrTrimFirstUpper(title);
        }
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
