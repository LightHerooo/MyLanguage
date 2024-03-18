const PATH_TO_IMAGES_FOLDER = "/images";
export class ImageSources {
    OTHER = new OtherFolder();
    RULES = new RulesFolder();
    CUSTOMER_COLLECTIONS = new CustomerCollectionsFolder();
    CUSTOMERS = new CustomersFolder();
    WORKOUTS = new WorkoutsFolder();
}

class OtherFolder {
    #PATH_TO_OTHER_FOLDER = PATH_TO_IMAGES_FOLDER + "/other";

    FLAME = this.#PATH_TO_OTHER_FOLDER + "/flame.png";
    ADD = this.#PATH_TO_OTHER_FOLDER + "/add.png";
    DELETE = this.#PATH_TO_OTHER_FOLDER + "/delete.png";
    ARROW_DOWN = this.#PATH_TO_OTHER_FOLDER + "/arrow_down.png";
    ARROW_UP = this.#PATH_TO_OTHER_FOLDER + "/arrow_up.png";
    ARROW_RIGHT = this.#PATH_TO_OTHER_FOLDER + "/arrow_right.png";
    HISTORY = this.#PATH_TO_OTHER_FOLDER + "/history.png";
    ACCEPT = this.#PATH_TO_OTHER_FOLDER + "/accept.png";
    QUESTION = this.#PATH_TO_OTHER_FOLDER + "/question.png";
}

class RulesFolder {
    #PATH_TO_RULES_FOLDER = PATH_TO_IMAGES_FOLDER + "/rules";

    ACCEPT = this.#PATH_TO_RULES_FOLDER + "/accept.png";
    WARNING = this.#PATH_TO_RULES_FOLDER + "/warning.png";
    ERROR = this.#PATH_TO_RULES_FOLDER + "/error.png";
}

class CustomerCollectionsFolder {
    #PATH_TO_CUSTOMER_COLLECTIONS_FOLDER = PATH_TO_IMAGES_FOLDER + "/customer_collections";

    BOOKS = this.#PATH_TO_CUSTOMER_COLLECTIONS_FOLDER + "/books.png";
}

class CustomersFolder {
    #PATH_TO_CUSTOMER_COLLECTIONS_FOLDER = PATH_TO_IMAGES_FOLDER + "/customers";

    ENTRY = this.#PATH_TO_CUSTOMER_COLLECTIONS_FOLDER + "/entry.png";
}

class WorkoutsFolder {
    #PATH_TO_CUSTOMER_COLLECTIONS_FOLDER = PATH_TO_IMAGES_FOLDER + "/workouts";

    BRAIN = this.#PATH_TO_CUSTOMER_COLLECTIONS_FOLDER + "/brain.png";
}