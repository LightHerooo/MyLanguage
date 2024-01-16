package ru.herooo.mylanguageweb.controllers.move;

// Перечисление путей к @Mapping-методам контроллеров
public enum Redirects {

    INDEX ("/"),

    CUSTOMERS_NEW ("/customers/new"),

    ENTRY ("/customers/entry");

    public final String URL;
    public final String REDIRECT_URL;

    Redirects(String url) {
        this.URL = url;
        this.REDIRECT_URL = "redirect:" + url;
    }
}
