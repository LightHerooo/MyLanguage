import {
    UrlPath
} from "./url_path.js";

export class UrlPaths {
    CUSTOMERS = new UrlPathsCustomers();
    WORKOUTS = new UrlPathsWorkouts();
    CUSTOMER_COLLECTIONS = new UrlPathsCustomerCollections();
}

class UrlPathsCustomers {
    #PATH = "/customers";

    INFO = new UrlPath(`${this.#PATH}/info`);
    AVATAR_DEFAULT = new UrlPath(`${this.#PATH}/avatars/0`);
}

class UrlPathsWorkouts {
    #PATH = "/workouts";

    MAIN = new UrlPath(this.#PATH);
    START = new UrlPath(`${this.#PATH}/start`);
    INFO = new UrlPath(`${this.#PATH}/info`);
}

class UrlPathsCustomerCollections {
    #PATH = "/customer_collections";

    EDIT = new UrlPath(`${this.#PATH}/edit`);
    IMAGE_DEFAULT = new UrlPath(`${this.#PATH}/images/0`);
}