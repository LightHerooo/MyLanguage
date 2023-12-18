package ru.herooo.mylanguageweb.controllers.move;

// Перечисление путей к шаблонам (templates)
public enum Views {
    INDEX ("index"),

    NOT_FOUND ("not_found"),

    WORDS_SHOW ("words/show"),

    CUSTOMERS_NEW ("customers/new"),

    CUSTOMERS_ENTRY ("customers/entry"),

    CUSTOMERS_SHOW_ONE ("customers/show_one")

    ;

    public final String PATH_TO_FILE;

    Views(String pathToFile) {
        this.PATH_TO_FILE = pathToFile;
    }
}
