package ru.herooo.mylanguageweb.dto.entity.workoutitem;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class WorkoutItemRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @Size(max = 44, message = "Длина ответа должна быть не более 44-х символов.")
    @JsonProperty("word_title_answer")
    private String wordTitleAnswer;

    @JsonProperty("security_key")
    private String securityKey;

    @JsonProperty("auth_code")
    private String authCode;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWordTitleAnswer() {
        return wordTitleAnswer;
    }

    public void setWordTitleAnswer(String wordTitleAnswer) {
        if (STRING_UTILS.isNotStringVoid(wordTitleAnswer)) {
            this.wordTitleAnswer = STRING_UTILS.getClearString(wordTitleAnswer);
        }
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getSecurityKey() {
        return securityKey;
    }

    public void setSecurityKey(String securityKey) {
        this.securityKey = securityKey;
    }
}
