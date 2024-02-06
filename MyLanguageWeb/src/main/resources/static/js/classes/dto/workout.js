import {
    CustomerResponseDTO
} from "./customer.js";
import {
    WorkoutTypeResponseDTO
} from "./workout_type.js";
import {
    LangResponseDTO
} from "./lang.js";
import {
    CustomerCollectionResponseDTO
} from "./customer_collection.js";

export class WorkoutResponseDTO {
    id;
    numberOfWords;
    dateOfStart;
    dateOfEnd;
    isActive;
    customer;
    workoutType;
    langIn;
    langOut;
    customerCollection;

    constructor(workoutJson) {
        if (workoutJson) {
            this.id = workoutJson["id"];
            this.numberOfWords = workoutJson["number_of_words"];
            this.dateOfStart = workoutJson["date_of_start"];
            this.dateOfEnd = workoutJson["date_of_end"];
            this.isActive = workoutJson["is_active"];
            this.customer = new CustomerResponseDTO(workoutJson["customer"]);
            this.workoutType = new WorkoutTypeResponseDTO(workoutJson["workout_type"]);
            this.langIn = new LangResponseDTO(workoutJson["lang_in"]);
            this.langOut = new LangResponseDTO(workoutJson["lang_out"]);
            this.customerCollection = new CustomerCollectionResponseDTO(workoutJson["customer_collection"]);
        }
    }
}

export class WorkoutRequestDTO {
    id;
    numberOfWords;
    workoutTypeCode;
    langInCode;
    langOutCode;
    collectionKey;
}