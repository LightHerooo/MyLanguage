package ru.herooo.mylanguageweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.YandexDicUtils;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsResult;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsUtils;
import ru.herooo.mylanguageweb.global.GlobalCookieUtils;

@SpringBootApplication(scanBasePackages= {
        "ru.herooo.mylanguageweb",
        "ru.herooo.mylanguagedb"})
@EnableJpaRepositories("ru.herooo.mylanguagedb.*")
@EntityScan("ru.herooo.mylanguagedb.*")
public class MyLanguageApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyLanguageApplication.class, args);

        /*YandexLangsUtils utils = new YandexLangsUtils();
        HttpJsonResponse response = utils.getHttpJsonResponse();
        if (response.getCode() == 200) {
            YandexLangsResult result = utils.getYandexLangsResult(response);
            for (String lang: result.getLangs()) {
                System.out.println(lang);
            }
        }*/
    }

    @Bean
    public StringUtils stringUtils() {
        return new StringUtils();
    }

    @Bean
    public GlobalCookieUtils globalCookieUtils() {
        return new GlobalCookieUtils();
    }

    @Bean
    public YandexDicUtils yandexDicUtils() {
        return new YandexDicUtils();
    }

    @Bean
    public YandexLangsUtils yandexLangsUtils() {
        return new YandexLangsUtils();
    }
}

