package ru.herooo.mylanguageweb.dto.entity.lang.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import ru.herooo.mylanguageutils.StringUtils;

public class LangEditRequestDTO {
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

    @JsonProperty("is_active_for_in")
    private boolean isActiveForIn;

    @JsonProperty("is_active_for_out")
    private boolean isActiveForOut;

    @JsonProperty("auth_key")
    private String authKey;

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

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public boolean getIsActiveForIn() {
        return isActiveForIn;
    }

    public void setIsActiveForIn(boolean isActiveForIn) {
        this.isActiveForIn = isActiveForIn;
    }

    public boolean getIsActiveForOut() {
        return isActiveForOut;
    }

    public void setIsActiveForOut(boolean isActiveForOut) {
        this.isActiveForOut = isActiveForOut;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
