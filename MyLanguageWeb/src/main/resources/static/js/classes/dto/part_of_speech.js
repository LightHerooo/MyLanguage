export class PartOfSpeechResponseDTO {
    id;
    title;
    code;
    colorHexCode;

    constructor(partOfSpeechJson) {
        if (partOfSpeechJson) {
            this.id = partOfSpeechJson["id"];
            this.title = partOfSpeechJson["title"];
            this.code = partOfSpeechJson["code"];
            this.colorHexCode = partOfSpeechJson["color_hex_code"];
        }
    }

    createDiv() {
        let div = document.createElement("div");
        div.style.color = "#" + this.colorHexCode;
        div.style.fontWeight = "bold";
        div.textContent = this.title;

        return div;
    }
}