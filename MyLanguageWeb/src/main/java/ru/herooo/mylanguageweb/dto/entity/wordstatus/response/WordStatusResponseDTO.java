package ru.herooo.mylanguageweb.dto.entity.wordstatus.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.herooo.mylanguageweb.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.json.l.LongSerializer;
import ru.herooo.mylanguageweb.dto.entity.color.response.ColorResponseDTO;

public class WordStatusResponseDTO {
    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("code")
    private String code;

    @JsonProperty("description")
    private String description;

    @JsonProperty("color")
    private ColorResponseDTO color;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ColorResponseDTO getColor() {
        return color;
    }

    public void setColor(ColorResponseDTO color) {
        this.color = color;
    }
}
