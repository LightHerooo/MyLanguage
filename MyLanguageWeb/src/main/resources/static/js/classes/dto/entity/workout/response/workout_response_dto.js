import {
    CustomerCollectionResponseDTO
} from "../../customer_collection/response/customer_collection_response_dto.js";

import {
    WorkoutTypeResponseDTO
} from "../../workout_type/response/workout_type_response_dto.js";

import {
    CustomerResponseDTO
} from "../../customer/response/customer_response_dto.js";

import {
    LangResponseDTO
} from "../../lang/response/lang_response_dto.js";

export class WorkoutResponseDTO {
    #id;
    #numberOfWords;
    #currentMilliseconds;
    #dateOfStart;
    #dateOfEnd;
    #customer;
    #workoutType;
    #langIn;
    #langOut;
    #customerCollection;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#numberOfWords = json["number_of_words"];
            this.#currentMilliseconds = json["current_milliseconds"];

            let dateOfStart = json["date_of_start"];
            if (dateOfStart) {
                this.#dateOfStart = new Date(dateOfStart);
            }

            let dateOfEnd = json["date_of_end"];
            if (dateOfEnd) {
                this.#dateOfEnd = new Date(dateOfEnd);
            }

            let customer = json["customer"];
            if (customer) {
                this.#customer = new CustomerResponseDTO(customer);
            }

            let workoutType = json["workout_type"];
            if (workoutType) {
                this.#workoutType = new WorkoutTypeResponseDTO(workoutType);
            }

            let langIn = json["lang_in"];
            if (langIn) {
                this.#langIn = new LangResponseDTO(langIn);
            }

            let langOut = json["lang_out"];
            if (langOut) {
                this.#langOut = new LangResponseDTO(langOut);
            }

            let customerCollection = json["customer_collection"];
            if (customerCollection) {
                this.#customerCollection = new CustomerCollectionResponseDTO(customerCollection);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getNumberOfWords() {
        return this.#numberOfWords;
    }

    getDateOfStart() {
        return this.#dateOfStart;
    }

    getDateOfEnd() {
        return this.#dateOfEnd;
    }

    getCurrentMilliseconds() {
        return this.#currentMilliseconds;
    }

    getCustomer() {
        return this.#customer;
    }

    getWorkoutType() {
        return this.#workoutType;
    }

    getLangIn() {
        return this.#langIn;
    }

    getLangOut() {
        return this.#langOut;
    }

    getCustomerCollection() {
        return this.#customerCollection;
    }
}