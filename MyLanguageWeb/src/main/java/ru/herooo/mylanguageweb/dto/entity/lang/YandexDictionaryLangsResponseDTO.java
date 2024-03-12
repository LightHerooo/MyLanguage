package ru.herooo.mylanguageweb.dto.entity.lang;

import com.fasterxml.jackson.annotation.JsonProperty;

public class YandexDictionaryLangsResponseDTO {
    @JsonProperty("lang_couples")
    private String[] langCouples;

    @JsonProperty("all_langs")
    private String[] allLangs;

    @JsonProperty("langs_in")
    private String[] langsIn;

    @JsonProperty("langs_out")
    private String[] langsOut;

    public String[] getLangCouples() {
        return langCouples;
    }

    public void setLangCouples(String[] langCouples) {
        this.langCouples = langCouples;
    }

    public String[] getAllLangs() {
        return allLangs;
    }

    public void setAllLangs(String[] allLangs) {
        this.allLangs = allLangs;
    }

    public String[] getLangsIn() {
        return langsIn;
    }

    public void setLangsIn(String[] langsIn) {
        this.langsIn = langsIn;
    }

    public String[] getLangsOut() {
        return langsOut;
    }

    public void setLangsOut(String[] langsOut) {
        this.langsOut = langsOut;
    }
}
