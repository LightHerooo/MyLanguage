package ru.herooo.mylanguageweb.controllers;

// Перечисление путей к @Mapping-методам контроллеров
public enum Redirects {
    INDEX ("/"),
    ENTRY ("/customers/entry"),
    CUSTOMER_COLLECTIONS("/customer_collections"),
    WORKOUTS("/workouts")
    ;

    public final String URL;
    public final String REDIRECT_URL;

    Redirects(String url) {
        this.URL = url;
        this.REDIRECT_URL = "redirect:" + url;
    }
}
