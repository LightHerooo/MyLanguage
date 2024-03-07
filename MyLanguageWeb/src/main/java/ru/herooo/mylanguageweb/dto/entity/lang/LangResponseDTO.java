package ru.herooo.mylanguageweb.dto.entity.lang;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.controllers.json.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.LongSerializer;

public class LangResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    private long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("code")
    private String code;

    @JsonProperty("code_for_translate")
    private String codeForTranslate;

    @JsonProperty("is_active_for_in")
    private boolean isActiveForIn;

    @JsonProperty("is_active_for_out")
    private boolean isActiveForOut;

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
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeForTranslate() {
        return codeForTranslate;
    }

    public void setCodeForTranslate(String codeForTranslate) {
        this.codeForTranslate = codeForTranslate;
    }

    public boolean getIsActiveForIn() {
        return isActiveForIn;
    }

    public void setIsActiveForIn(boolean activeForIn) {
        isActiveForIn = activeForIn;
    }

    public boolean getIsActiveForOut() {
        return isActiveForOut;
    }

    public void setIsActiveForOut(boolean activeForOut) {
        isActiveForOut = activeForOut;
    }
}
