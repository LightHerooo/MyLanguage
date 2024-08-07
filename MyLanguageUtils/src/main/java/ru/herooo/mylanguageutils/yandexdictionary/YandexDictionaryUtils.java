package ru.herooo.mylanguageutils.yandexdictionary;

import ru.herooo.mylanguageutils.ProjectPaths;
import ru.herooo.mylanguageutils.outsidefolder.OutsideFolders;

import java.io.*;
import java.util.Properties;

public class YandexDictionaryUtils {
    public YandexDictionaryProperties getProperties() {
        final String APIPathForTranslatePropertyKey = "API_PATH_FOR_TRANSLATE";
        final String APIKeyForTranslatePropertyKey = "API_KEY_FOR_TRANSLATE";

        final String APIPathForLangsPropertyKey = "API_PATH_FOR_LANGS";
        final String APIKeyForLangsPropertyKey = "API_KEY_FOR_LANGS";

        Properties properties = new Properties();
        File propertiesFile = new File(String.format("%s/%s", OutsideFolders.MAIN.FOLDER.getFolder().getPath(),
                "yandex_dictionary.conf"));
        if (propertiesFile.exists()) {
            try (FileInputStream fis = new FileInputStream(propertiesFile)) {
                properties.load(fis);
            } catch (IOException e) {
                throw new RuntimeException("Не удалось прочитать конфигурационный файл Yandex.Dictionary");
            }
        } else {
            properties.put(APIPathForTranslatePropertyKey, "https://dictionary.yandex.net/api/v1/dicservice.json/lookup");
            properties.put(APIKeyForTranslatePropertyKey, "");

            properties.put(APIPathForLangsPropertyKey, "https://dictionary.yandex.net/api/v1/dicservice.json/getLangs");
            properties.put(APIKeyForLangsPropertyKey, "");
            try (FileOutputStream fos = new FileOutputStream(propertiesFile)) {
                properties.store(fos, null);
            } catch (IOException e) {
                throw new RuntimeException("Не удалось создать конфигурационный файл Yandex.Dictionary");
            }
        }

        YandexDictionaryProperties yandexDictionaryProperties = new YandexDictionaryProperties();
        yandexDictionaryProperties.setAPIPathForTranslate(properties.getProperty(APIPathForTranslatePropertyKey));
        yandexDictionaryProperties.setAPIKeyForTranslate(properties.getProperty(APIKeyForTranslatePropertyKey));

        yandexDictionaryProperties.setAPIPathForLangs(properties.getProperty(APIPathForLangsPropertyKey));
        yandexDictionaryProperties.setAPIKeyForLangs(properties.getProperty(APIKeyForLangsPropertyKey));

        return yandexDictionaryProperties;
    }
}
