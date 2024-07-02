import {
    UrlPath
} from "./url_path.js";

export class UrlPaths {
    CUSTOMERS = new UrlPathsCustomers();
    WORKOUTS = new UrlPathsWorkouts();
}

class UrlPathsCustomers {
    #PATH = "/customers";

    INFO = new UrlPath(`${this.#PATH}/info`);
    AVATAR_DEFAULT = new UrlPath(`${this.#PATH}/avatar/0`);
}

class UrlPathsWorkouts {
    #PATH = "/workouts";

    MAIN = new UrlPath(this.#PATH);
    START = new UrlPath(`${this.#PATH}/start`);
    INFO = new UrlPath(`${this.#PATH}/info`);
}