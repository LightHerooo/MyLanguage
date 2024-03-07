package ru.herooo.mylanguageutils.yandexdictionary.yandexlangs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.http.HttpURLConnectionUtils;
import ru.herooo.mylanguageutils.http.URLUtils;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryError;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryProperties;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

public class YandexLangsUtils {
    public HttpJsonResponse getHttpJsonResponse() {
        YandexDictionaryUtils utils = new YandexDictionaryUtils();
        YandexDictionaryProperties properties = utils.getProperties();

        // Создаём мапу с параметрами будущего GET-запроса
        HashMap<String, String> params = new HashMap<>();
        params.put("key", properties.getAPIKeyForLangs());

        // Пытаемся сгенерировать URL с параметрами
        URLUtils urlUtils = new URLUtils();
        URL url = null;
        try {
            url = urlUtils.createGET(properties.getAPIPathForLangs(), params);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        // Отправляем запрос, получаем ответ
        return new HttpURLConnectionUtils().sendGET(url);
    }

    public YandexLangsResult getYandexLangsResult(HttpJsonResponse httpJsonResponse) {
        YandexLangsResult result = null;
        if (httpJsonResponse.getCode() == 200) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String[] langs = mapper.readValue(httpJsonResponse.getJsonStr(), String[].class);

                result = new YandexLangsResult();
                result.setLangs(langs);

            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        return result;
    }

    public YandexDictionaryError getYandexLangsError(HttpJsonResponse httpJsonResponse) {
        YandexDictionaryError result = null;

        if (httpJsonResponse.getCode() != 200) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                result = mapper.readValue(httpJsonResponse.getJsonStr(), YandexDictionaryError.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        String message = "Неизвестная ошибка обращения к языкам API словаря.";
        if (result != null) {
            switch (result.getCode()) {
                case 401 -> message = "Ключ API невалиден.";
                case 402 -> message = "Ключ API заблокирован.";
            }

            result.setMessage(message);
        } else {
            result = new YandexDictionaryError();
            result.setCode(500);
            result.setMessage(message);
        }

        return result;
    }
}
