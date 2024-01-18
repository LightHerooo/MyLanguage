export class WordStatusResponseDTO {
    id;
    title;
    code;
    message;
    colorHexCode;

    constructor(wordStatusJson) {
        if (wordStatusJson) {
            this.id = wordStatusJson["id"];
            this.title = wordStatusJson["title"];
            this.code = wordStatusJson["code"];
            this.message = wordStatusJson["message"];
            this.colorHexCode = wordStatusJson["color_hex_code"];
        }
    }

    createA() {
        let aWordStatus = document.createElement("a");
        aWordStatus.style.cursor = "pointer";
        aWordStatus.style.textDecoration = "underline dotted";
        aWordStatus.style.color = "#" + this.colorHexCode;
        aWordStatus.style.fontWeight = "bold";
        aWordStatus.title = this.message;
        aWordStatus.textContent = this.title;

        return aWordStatus;
    }
}