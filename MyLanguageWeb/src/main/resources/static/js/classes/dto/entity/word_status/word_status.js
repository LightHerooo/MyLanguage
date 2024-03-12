import {
    ColorResponseDTO
} from "../color.js";

export class WordStatusResponseDTO {
    id;
    title;
    code;
    message;
    color;

    constructor(wordStatusJson) {
        if (wordStatusJson) {
            this.id = wordStatusJson["id"];
            this.title = wordStatusJson["title"];
            this.code = wordStatusJson["code"];
            this.message = wordStatusJson["message"];

            let color = wordStatusJson["color"];
            if (color) {
                this.color = new ColorResponseDTO(color);
            }
        }
    }

    createA() {
        let aWordStatus = document.createElement("a");
        aWordStatus.style.cursor = "pointer";
        aWordStatus.style.textDecoration = "underline dotted";

        let color = this.color;
        if (color) {
            aWordStatus.style.color = "#" + color.hexCode;
        }

        aWordStatus.style.fontWeight = "bold";
        aWordStatus.title = this.message;
        aWordStatus.textContent = this.title;

        return aWordStatus;
    }
}