package ru.herooo.mylanguageweb.dto.entity.lang.other;

import com.fasterxml.jackson.annotation.JsonProperty;

public class YandexDictionaryLangsResponseDTO {
    @JsonProperty("lang_code_couples")
    private String[] langCodeCouples;

    @JsonProperty("lang_codes")
    private String[] langCodes;

    @JsonProperty("lang_in_codes")
    private String[] langInCodes;

    @JsonProperty("lang_out_codes")
    private String[] langOutCodes;

    public String[] getLangCodeCouples() {
        return langCodeCouples;
    }

    public void setLangCodeCouples(String[] langCodeCouples) {
        this.langCodeCouples = langCodeCouples;
    }

    public String[] getLangCodes() {
        return langCodes;
    }

    public void setLangCodes(String[] langCodes) {
        this.langCodes = langCodes;
    }

    public String[] getLangInCodes() {
        return langInCodes;
    }

    public void setLangInCodes(String[] langInCodes) {
        this.langInCodes = langInCodes;
    }

    public String[] getLangOutCodes() {
        return langOutCodes;
    }

    public void setLangOutCodes(String[] langOutCodes) {
        this.langOutCodes = langOutCodes;
    }
}
