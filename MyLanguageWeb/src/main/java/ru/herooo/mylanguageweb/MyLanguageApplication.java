package ru.herooo.mylanguageweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.YandexDicUtils;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsUtils;
import ru.herooo.mylanguageweb.projectcookie.ProjectCookiesUtils;

@SpringBootApplication(scanBasePackages= {
        "ru.herooo.mylanguageweb",
        "ru.herooo.mylanguagedb"})
@EnableJpaRepositories("ru.herooo.mylanguagedb.*")
@EntityScan("ru.herooo.mylanguagedb.*")
public class MyLanguageApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyLanguageApplication.class, args);
    }

    @Bean
    public StringUtils stringUtils() {
        return new StringUtils();
    }

    @Bean
    public FileUtils fileUtils() {
        return new FileUtils();
    }

    @Bean
    public ProjectCookiesUtils projectCookiesUtils() {
        return new ProjectCookiesUtils();
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

