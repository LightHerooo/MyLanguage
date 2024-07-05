package ru.herooo.mylanguageweb.dto.entity.word.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;

public class WordAddRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @NotBlank(message = "Слово не может быть пустым")
    @Size(max = 44, message = "Длина должна быть не более 44-х символов")
    @Pattern(regexp = "^[^ ]+$", message = "Слово не должно содержать пробелов")
    @JsonProperty("title")
    private String title;

    @NotBlank(message = "Выберите язык")
    @JsonProperty("lang_code")
    private String langCode;

    @JsonProperty("auth_key")
    private String authKey;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        if (!STRING_UTILS.isStringVoid(title)) {
            this.title = STRING_UTILS.createStrTrimToLower(title);
        }
    }

    public String getLangCode() {
        return langCode;
    }

    public void setLangCode(String langCode) {
        this.langCode = langCode;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }
}
