package ru.herooo.mylanguageweb.controllers.move;

// Перечисление путей к шаблонам (templates)
public enum Views {
    NOT_FOUND ("not_found"),

    INDEX ("index"),

    WORKOUTS_SHOW("workouts/show"),
    WORKOUTS_START("workouts/start"),
    WORKOUTS_RANDOM_WORDS("workouts/types/random_words"),
    WORKOUTS_COLLECTION_WORKOUT("workouts/types/collection_workout"),
    WORKOUTS_SHOW_INFO_ONE("workouts/show_info_one"),

    WORDS_SHOW("words/show"),
    WORDS_NEW("words/new"),
    WORDS_MY_WORDS_HISTORY("words/my_words_history"),

    CUSTOMERS_NEW ("customers/new"),
    CUSTOMERS_ENTRY ("customers/entry"),
    CUSTOMERS_SHOW_ONE ("customers/show_one"),

    CUSTOMER_COLLECTIONS_SHOW("customer_collections/show"),
    CUSTOMER_COLLECTIONS_NEW("customer_collections/new"),

    SPECIAL_ACTIONS_SHOW("special_actions/show"),
    SPECIAL_ACTIONS_CHANGE_CURRENT_STATUS_TO_WORDS("special_actions/actions/change_current_status_to_words"),
    SPECIAL_ACTIONS_CHANGE_ACTIVE_STATUSES_TO_LANGS("special_actions/actions/change_active_statuses_to_langs"),
    SPECIAL_ACTIONS_CHANGE_ACTIVE_STATUS_TO_WORKOUT_TYPES(
            "special_actions/actions/change_active_status_to_workout_types"),
    SPECIAL_ACTIONS_CHANGE_ROLE_TO_CUSTOMERS(
            "special_actions/actions/change_role_to_customers"),
    ;

    public final String PATH_TO_FILE;

    Views(String pathToFile) {
        this.PATH_TO_FILE = pathToFile;
    }
}
