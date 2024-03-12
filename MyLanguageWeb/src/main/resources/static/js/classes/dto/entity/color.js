export class ColorResponseDTO {
    id;
    title;
    hexCode;

    constructor(colorJson) {
        if (colorJson) {
            this.id = colorJson["id"];
            this.title = colorJson["title"];
            this.hexCode = colorJson["hex_code"];
        }
    }
}