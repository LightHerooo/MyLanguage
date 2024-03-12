package ru.herooo.mylanguageweb.dto.entity.word;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WordRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @NotBlank(message = "Слово не может быть пустым.")
    @Size(max = 44, message = "Длина должна быть не более 44-х символов.")
    @Pattern(regexp = "^[^ ]+$", message = "Слово не должно содержать пробелов.")
    @JsonProperty("title")
    private String title;

    @NotBlank(message = "Выберите язык.")
    @JsonProperty("lang_code")
    private String langCode;

    @JsonProperty("word_status_code")
    private String wordStatusCode;

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
            this.title = STRING_UTILS.getClearString(title);
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

    public String getWordStatusCode() {
        return wordStatusCode;
    }

    public void setWordStatusCode(String wordStatusCode) {
        this.wordStatusCode = wordStatusCode;
    }
}
