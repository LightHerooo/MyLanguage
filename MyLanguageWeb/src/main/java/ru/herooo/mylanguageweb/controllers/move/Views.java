package ru.herooo.mylanguageweb.controllers.move;

// Перечисление путей к шаблонам (templates)
public enum Views {
    NOT_FOUND ("not_found"),

    INDEX ("index"),

    WORKOUTS_SHOW("workouts/show"),
    WORKOUTS_START("workouts/start"),
    WORKOUTS_RANDOM_WORDS("workouts/types/random_words"),

    WORDS_SHOW("words/show"),
    WORDS_NEW("words/new"),
    WORDS_MY_WORDS_HISTORY("words/my_words_history"),

    CUSTOMERS_NEW ("customers/new"),
    CUSTOMERS_ENTRY ("customers/entry"),
    CUSTOMERS_SHOW_ONE ("customers/show_one"),

    CUSTOMER_COLLECTIONS_SHOW("customer_collections/show"),
    CUSTOMER_COLLECTIONS_NEW("customer_collections/new"),

    SPECIAL_ACTIONS_SHOW("special_actions/show"),
    SPECIAL_ACTIONS_CHANGE_CURRENT_STATUS_TO_WORDS("special_actions/change_current_status_to_words")
    ;

    public final String PATH_TO_FILE;

    Views(String pathToFile) {
        this.PATH_TO_FILE = pathToFile;
    }
}
