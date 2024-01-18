export class CustomResponseMessage {
    id;
    text;

    constructor(customResponseMessageJson) {
        if (customResponseMessageJson) {
            this.id = customResponseMessageJson["id"];
            this.text = customResponseMessageJson["text"];
        }
    }
}