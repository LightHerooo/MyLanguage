import {
    CustomerRoleResponseDTO
} from "./customer_role.js";

export class CustomerResponseDTO {
    id;
    nickname;
    role;
    dateOfCreate;
    dateOfLastVisit;

    constructor(customerJson) {
        if (customerJson) {
            this.id = customerJson["id"];
            this.nickname = customerJson["nickname"];
            this.role = new CustomerRoleResponseDTO(customerJson["role"]);
            this.dateOfCreate = customerJson["date_of_create"];
            this.dateOfLastVisit = customerJson["date_of_last_visit"];
        }
    }
}