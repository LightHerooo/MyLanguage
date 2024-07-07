import {
    UrlPath
} from "./url_path.js";

export class UrlPaths {
    CUSTOMERS = new UrlPathsCustomers();
    WORKOUTS = new UrlPathsWorkouts();
    CUSTOMER_COLLECTIONS = new UrlPathsCustomerCollections();
    SPECIAL_ACTIONS = new UrlPathsSpecialActions();
}

class UrlPathsCustomers {
    #PATH = "/customers";

    INFO = new UrlPath(`${this.#PATH}/info`);
    AVATAR_DEFAULT = new UrlPath(`${this.#PATH}/avatars/0`);
}

class UrlPathsWorkouts {
    #PATH = "/workouts";

    MAIN = new UrlPath(this.#PATH);
    PREPARE = new UrlPath(`${this.#PATH}/prepare`);
    START = new UrlPath(`${this.#PATH}/start`);
    INFO = new UrlPath(`${this.#PATH}/info`);
}

class UrlPathsCustomerCollections {
    #PATH = "/customer_collections";

    EDIT = new UrlPath(`${this.#PATH}/edit`);
    IMAGE_DEFAULT = new UrlPath(`${this.#PATH}/images/0`);
}

// Специальные возможности ---
class UrlPathsSpecialActions {
    LANGS = new UrlPathsSpecialActionsLangs();
}

class UrlPathsSpecialActionsLangs {
    #PATH = "/special_actions/langs"

    ADD = new UrlPath(`${this.#PATH}/add`);
    EDIT = new UrlPath(`${this.#PATH}/edit`);
}
//---