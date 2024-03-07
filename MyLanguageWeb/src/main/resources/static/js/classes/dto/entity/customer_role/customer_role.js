export class CustomerRoleResponseDTO {
    id;
    title;
    pathToImage;

    constructor(customerRoleJson) {
        if (customerRoleJson) {
            this.id = customerRoleJson["id"];
            this.title = customerRoleJson["title"];
            this.pathToImage = customerRoleJson["path_to_image"];
        }
    }
}