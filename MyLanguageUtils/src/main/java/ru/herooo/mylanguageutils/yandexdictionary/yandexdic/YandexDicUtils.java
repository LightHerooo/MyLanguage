package ru.herooo.mylanguageutils.yandexdictionary.yandexdic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.http.HttpURLConnectionUtils;
import ru.herooo.mylanguageutils.http.URLUtils;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryError;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryProperties;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

public class YandexDicUtils {
    public HttpJsonResponse getHttpJsonResponse(String word, String langInCode, String langOutCode) {
        YandexDictionaryUtils utils = new YandexDictionaryUtils();
        YandexDictionaryProperties properties = utils.getProperties();

        // Создаём мапу с параметрами будущего GET-запроса
        HashMap<String, String> params = new HashMap<>();
        params.put("text", word);
        params.put("lang", String.format("%s-%s", langInCode, langOutCode));
        params.put("key", properties.getAPIKeyForTranslate());

        // Пытаемся сгенерировать URL с параметрами
        URLUtils urlUtils = new URLUtils();
        URL url = null;
        try {
            url = urlUtils.createGET(properties.getAPIPathForTranslate(), params);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        // Отправляем запрос, получаем ответ
        return new HttpURLConnectionUtils().sendGET(url);
    }

    public YandexDicResult getYandexDicResult(HttpJsonResponse httpJsonResponse) {
        YandexDicResult result = null;
        if (httpJsonResponse.getCode() == 200) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                result = mapper.readValue(httpJsonResponse.getJsonStr(), YandexDicResult.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        return result;
    }

    public YandexDictionaryError getYandexDicError(HttpJsonResponse httpJsonResponse) {
        YandexDictionaryError result = null;

        if (httpJsonResponse.getCode() != 200) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                result = mapper.readValue(httpJsonResponse.getJsonStr(), YandexDictionaryError.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        String message = "Неизвестная ошибка обращения к переводам API словаря.";
        if (result != null) {
            switch (result.getCode()) {
                case 401 -> message = "Ключ API невалиден.";
                case 402 -> message = "Ключ API заблокирован.";
                case 403 -> message = "Превышено суточное ограничение на количество запросов.";
                case 413 -> message = "Превышен максимальный размер текста.";
                case 501 -> message = "Заданное направление перевода не поддерживается.";
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
