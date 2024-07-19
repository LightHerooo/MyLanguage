package ru.herooo.mylanguageweb;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryUtils;

public class WebInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // Генерируем файл ключей, если его не существует
        new YandexDictionaryUtils().getProperties();

        return application.sources(MyLanguageApplication.class);
    }
}
