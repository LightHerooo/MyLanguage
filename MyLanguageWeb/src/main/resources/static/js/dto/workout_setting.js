import {
    WorkoutTypeResponseDTO
} from "./workout_type.js";

import {
    CustomerResponseDTO
} from "./customer.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    CustomerCollectionResponseDTO
} from "./customer_collection.js";

export class WorkoutSettingResponseDTO {
    id;
    numberOfWords;
    workoutType;
    customer;
    langOut;
    langIn;
    customerCollection;

    constructor(workoutSettingJson) {
        this.id = workoutSettingJson["id"];
        this.numberOfWords = workoutSettingJson["number_of_words"];

        if (workoutSettingJson["workout_type"]) {
            this.workoutType = new WorkoutTypeResponseDTO(workoutSettingJson["workout_type"])
        }

        if (workoutSettingJson["customer"]) {
            this.customer = new CustomerResponseDTO(workoutSettingJson["customer"]);
        }

        if (workoutSettingJson["lang_out"]) {
            this.langOut = new LangResponseDTO(workoutSettingJson["lang_out"]);
        }

        if (workoutSettingJson["lang_in"]) {
            this.langIn = new LangResponseDTO(workoutSettingJson["lang_in"]);
        }

        if (workoutSettingJson["customer_collection"]) {
            this.customerCollection = new CustomerCollectionResponseDTO(workoutSettingJson["customer_collection"]);
        }
    }
}

export class WorkoutSettingRequestDTO {
    id;
    numberOfWords;
    langOutCode;
    langInCode;
    customerCollectionKey;
}