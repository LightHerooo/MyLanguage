import {
    CustomerRoleResponseDTO
} from "../../customer_role/response/customer_role_response_dto.js";

import {
    CountryResponseDTO
} from "../../country/response/country_response_dto.js";

export class CustomerResponseDTO {
    #id;
    #nickname;
    #pathToAvatar;
    #description;
    #dateOfCreate;
    #dateOfLastVisit;
    #role;
    #country;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#nickname = json["nickname"];
            this.#pathToAvatar = json["path_to_avatar"];
            this.#description = json["description"];

            let dateOfCreate = json["date_of_create"];
            if (dateOfCreate) {
                this.#dateOfCreate = new Date(dateOfCreate);
            }

            let dateOfLastVisit = json["date_of_last_visit"];
            if (dateOfLastVisit) {
                this.#dateOfLastVisit = new Date(dateOfLastVisit);
            }

            let role = json["role"];
            if (role) {
                this.#role = new CustomerRoleResponseDTO(role);
            }

            let country = json["country"];
            if (country) {
                this.#country = new CountryResponseDTO(country);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getNickname() {
        return this.#nickname;
    }

    getPathToAvatar() {
        return this.#pathToAvatar;
    }

    getDescription() {
        return this.#description;
    }

    getDateOfCreate() {
        return this.#dateOfCreate;
    }

    getDateOfLastVisit() {
        return this.#dateOfLastVisit;
    }

    getRole() {
        return this.#role;
    }

    getCountry() {
        return this.#country;
    }
}
