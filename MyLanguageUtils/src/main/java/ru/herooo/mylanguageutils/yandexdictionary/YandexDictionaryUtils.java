package ru.herooo.mylanguageutils.yandexdictionary;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.yandexdictionary.dicresult.DicResult;
import ru.herooo.mylanguageutils.yandexdictionary.errorresult.ErrorResult;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class YandexDictionaryUtils {
    public YandexDictionaryResponse getResponse(String word, String langInCode, String langOutCode) {
        YandexDictionaryProperties properties = getProperties();

        // Создаём мапу с параметрами будущего GET-запроса
        HashMap<String, String> params =
                createHashMapWithParams(word, langInCode, langOutCode, properties.getAPIKey());

        // Создаём GET-запрос с параметрами из мапы, отправляем
        YandexDictionaryResponse response = null;
        HttpURLConnection con = null;
        try {
            URL url = createGETUrlWithParams(properties.getAPIPath(), params);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setConnectTimeout(15 * 1000);
            con.setReadTimeout(15 * 1000);
            con.connect();

            int code = con.getResponseCode();
            String jsonStr = readResponse(con.getInputStream());

            response = new YandexDictionaryResponse(code, jsonStr);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }

        return response;
    }

    public DicResult getDicResult(YandexDictionaryResponse response) {
        DicResult result = null;
        if (response.code == 200) {
            StringUtils stringUtils = new StringUtils();
            if (stringUtils.isNotStringVoid(response.jsonStr)) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    result = mapper.readValue(response.jsonStr, DicResult.class);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }

    public ErrorResult getErrorResult(YandexDictionaryResponse response) {
        String message = "Неизвестная ошибка API.";
        switch (response.code) {
            case 401 -> message = "Ключ API невалиден.";
            case 402 -> message = "Ключ API заблокирован.";
            case 403 -> message = "Превышено суточное ограничение на количество запросов.";
            case 413 -> message = "Превышен максимальный размер текста.";
            case 501 -> message = "Заданное направление перевода не поддерживается.";
        }

        ErrorResult result = new ErrorResult();
        result.setCode(response.code);
        result.setMessage(message);

        return result;
    }

    private YandexDictionaryProperties getProperties() {
        final String APIPathPropertyKey = "API_PATH";
        final String APIKeyPropertyKey = "API_KEY";

        String propertiesPath = String.format("%s/%s", System.getProperty("user.dir"), "yandex_dictionary.conf");
        File propertiesFile = new File(propertiesPath);
        Properties properties = new Properties();
        if (propertiesFile.exists()) {
            try (FileInputStream fis = new FileInputStream(propertiesFile)) {
                properties.load(fis);
            } catch (IOException e) {
                throw new RuntimeException("Не удалось прочитать конфигурационный файл Yandex.Dictionary.");
            }

        } else {
            properties.put(APIPathPropertyKey, "https://dictionary.yandex.net/api/v1/dicservice.json/lookup");
            properties.put(APIKeyPropertyKey, "");
            try (FileOutputStream fos = new FileOutputStream(propertiesFile)) {
                properties.store(fos, null);
            } catch (IOException e) {
                throw new RuntimeException("Не удалось создать конфигурационный файл Yandex.Dictionary.");
            }
        }

        YandexDictionaryProperties yandexDictionaryProperties = new YandexDictionaryProperties();
        yandexDictionaryProperties.setAPIPath(properties.getProperty(APIPathPropertyKey));
        yandexDictionaryProperties.setAPIKey(properties.getProperty(APIKeyPropertyKey));

        return yandexDictionaryProperties;
    }

    private HashMap<String, String> createHashMapWithParams(String word,
                                                            String langInCode,
                                                            String langOutCode,
                                                            String APIKey) {
        final String LANG_REQUEST_PARAM_KEY = "lang";
        final String WORD_REQUEST_PARAM_KEY = "text";
        final String API_KEY_REQUEST_PARAM_KEY = "key";

        HashMap<String, String> params = new HashMap<>();
        params.put(LANG_REQUEST_PARAM_KEY,
                String.format("%s-%s", langInCode, langOutCode));
        params.put(WORD_REQUEST_PARAM_KEY, word);
        params.put(API_KEY_REQUEST_PARAM_KEY, APIKey);

        return params;
    }

    private URL createGETUrlWithParams(String path, HashMap<String, String> params) throws MalformedURLException {
        final StringUtils STRING_UTILS = new StringUtils();

        if (params != null && params.size() > 0) {
            StringBuilder paramsStr = new StringBuilder();
            for (Map.Entry<String, String> param: params.entrySet()) {
                if (STRING_UTILS.isNotStringVoid(param.getValue())) {
                    paramsStr.append(param.getKey());
                    paramsStr.append("=");
                    paramsStr.append(param.getValue());
                    paramsStr.append("&");
                }
            }

            if (paramsStr.length() > 0) {
                path += "?" + paramsStr.substring(0, paramsStr.length() - 1);
            }
        }

        return URI.create(path).toURL();
    }

    private String readResponse(InputStream urlInputStream) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(urlInputStream))) {
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }

            return content.toString();
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }
}
