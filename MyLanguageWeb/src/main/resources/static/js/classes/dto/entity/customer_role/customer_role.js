import {
    ColorResponseDTO
} from "../color.js";

export class CustomerRoleResponseDTO {
    id;
    title;
    pathToImage;
    code;
    message;
    color;

    constructor(customerRoleJson) {
        if (customerRoleJson) {
            this.id = customerRoleJson["id"];
            this.title = customerRoleJson["title"];
            this.pathToImage = customerRoleJson["path_to_image"];
            this.code = customerRoleJson["code"];
            this.message = customerRoleJson["message"];

            let color = customerRoleJson["color"];
            if (color) {
                this.color = new ColorResponseDTO(color);
            }
        }
    }
}