package ru.herooo.mylanguageutils.yandexdictionary;

public class YandexDictionaryResponse {
    int code;
    String jsonStr;

    public YandexDictionaryResponse(int code, String jsonStr) {
        this.code = code;
        this.jsonStr = jsonStr;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getJsonStr() {
        return jsonStr;
    }

    public void setJsonStr(String jsonStr) {
        this.jsonStr = jsonStr;
    }
}
