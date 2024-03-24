export class DateResponse {
    date;

    constructor(dateResponseJson) {
        if (dateResponseJson) {
            let value = dateResponseJson["value"];
            if (value) {
                this.date = new Date(value);
            }
        }
    }
}