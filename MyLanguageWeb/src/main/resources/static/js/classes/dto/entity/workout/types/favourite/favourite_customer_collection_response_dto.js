import {
    CustomerCollectionResponseDTO
} from "../../../customer_collection/response/customer_collection_response_dto.js";

export class FavouriteCustomerCollectionResponseDTO {
    #numberOfWorkouts;
    #customerCollection;

    constructor(json) {
        if (json) {
            this.#numberOfWorkouts = json["number_of_workouts"];

            let customerCollection = json["customer_collection"];
            if (customerCollection) {
                this.#customerCollection = new CustomerCollectionResponseDTO(customerCollection);
            }
        }
    }

    getNumberOfWorkouts() {
        return this.#numberOfWorkouts;
    }

    getCustomerCollection() {
        return this.#customerCollection;
    }
}