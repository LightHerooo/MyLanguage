export class LongResponse {
    value;

    constructor(longResponseJson) {
        if (longResponseJson) {
            this.value = longResponseJson["value"];
        }
    }
}