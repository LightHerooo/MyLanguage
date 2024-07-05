package ru.herooo.mylanguageweb.dto.entity.customercollection.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.json.l.LongDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.LongSerializer;
import ru.herooo.mylanguageweb.controllers.json.l.array.LongArrayDeserializer;
import ru.herooo.mylanguageweb.controllers.json.l.array.LongArraySerializer;

public class CustomerCollectionEditRequestDTO {
    private final StringUtils STRING_UTILS = new StringUtils();

    @JsonSerialize(using = LongSerializer.class)
    @JsonDeserialize(using = LongDeserializer.class)
    @JsonProperty("id")
    private long id;

    @NotBlank(message = "Название не может быть пустым")
    @Size(min = 3, max = 30, message = "Название должно быть от 3-х до 30-ти символов")
    @JsonProperty("title")
    private String title;

    @JsonProperty("is_active_for_author")
    private boolean isActiveForAuthor;

    @JsonProperty("description")
    private String description;

    @JsonProperty("do_need_to_delete_all_words")
    private boolean doNeedToDeleteAllWords;

    @JsonSerialize(using = LongArraySerializer.class)
    @JsonDeserialize(using = LongArrayDeserializer.class)
    @JsonProperty("excluded_word_in_collection_ids")
    private Long[] excludedWordInCollectionIds;

    @JsonProperty("auth_key")
    private String authKey;


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
        if (!STRING_UTILS.isStringVoid(title)) {
            this.title = title.trim();
        }
    }

    public boolean getIsActiveForAuthor() {
        return isActiveForAuthor;
    }

    public void setIsActiveForAuthor(boolean activeForAuthor) {
        isActiveForAuthor = activeForAuthor;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthKey() {
        return authKey;
    }

    public void setAuthKey(String authKey) {
        this.authKey = authKey;
    }

    public boolean getDoNeedToDeleteAllWords() {
        return doNeedToDeleteAllWords;
    }

    public void setDoNeedToDeleteAllWords(boolean doNeedToDeleteAllWords) {
        this.doNeedToDeleteAllWords = doNeedToDeleteAllWords;
    }

    public Long[] getExcludedWordInCollectionIds() {
        return excludedWordInCollectionIds;
    }

    public void setExcludedWordInCollectionIds(Long[] excludedWordInCollectionIds) {
        this.excludedWordInCollectionIds = excludedWordInCollectionIds;
    }
}
