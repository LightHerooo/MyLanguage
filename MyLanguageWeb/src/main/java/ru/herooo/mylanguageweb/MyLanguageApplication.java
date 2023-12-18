package ru.herooo.mylanguageweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.herooo.mylanguageutils.StringUtils;

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
}
