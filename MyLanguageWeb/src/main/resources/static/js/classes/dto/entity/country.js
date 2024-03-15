export class CountryResponseDTO {
    id;
    title;
    code;

    constructor(countryJson) {
        if (countryJson) {
            this.id = countryJson["id"];
            this.title = countryJson["title"];
            this.code = countryJson["code"];
        }
    }
}