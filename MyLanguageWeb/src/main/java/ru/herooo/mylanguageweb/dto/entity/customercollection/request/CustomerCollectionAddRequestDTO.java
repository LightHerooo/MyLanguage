package ru.herooo.mylanguageweb.dto.entity.customercollection.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class CustomerCollectionAddRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @NotBlank(message = "Название не может быть пустым.")
    @Size(min = 3, max = 30, message = "Название должно быть от 3-х до 30-ти символов.")
    @JsonProperty("title")
    private String title;

    @NotBlank(message = "Выберите язык.")
    @JsonProperty("lang_code")
    private String langCode;

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("workout_id")
    private long workoutId;

    @JsonProperty("auth_key")
    private String authKey;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        if (!STRING_UTILS.isStringVoid(title)) {
            this.title = title.trim();
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

    public long getWorkoutId() {
        return workoutId;
    }

    public void setWorkoutId(long workoutId) {
        this.workoutId = workoutId;
    }
}
