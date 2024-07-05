package ru.herooo.mylanguageweb.controllers;

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

    CUSTOMERS_REGISTRATION("customers/registration"),
    CUSTOMERS_ENTRY ("customers/entry"),
    CUSTOMERS_SHOW_INFO_ONE("customers/show_info_one"),
    CUSTOMERS_EDIT("customers/edit"),

    CUSTOMER_COLLECTIONS_NEW("customer_collections/new"),
    CUSTOMER_COLLECTIONS_EDIT("customer_collections/edit"),
    CUSTOMER_COLLECTIONS_COLLECTIONS_SHOW("customer_collections/show"),

    SPECIAL_ACTIONS_SHOW("special_actions/show"),
    SPECIAL_ACTIONS_EDIT_CURRENT_STATUS_TO_WORDS("special_actions/actions/edit_current_status_to_words"),
    SPECIAL_ACTIONS_EDIT_ACTIVE_STATUSES_TO_LANGS("special_actions/actions/edit_active_statuses_to_langs"),
    SPECIAL_ACTIONS_EDIT_ACTIVE_STATUS_TO_WORKOUT_TYPES(
            "special_actions/actions/edit_active_status_to_workout_types"),
    SPECIAL_ACTIONS_EDIT_ROLE_TO_CUSTOMERS(
            "special_actions/actions/edit_role_to_customers"),
    ;

    public final String PATH_TO_FILE;

    Views(String pathToFile) {
        this.PATH_TO_FILE = pathToFile;
    }
}
