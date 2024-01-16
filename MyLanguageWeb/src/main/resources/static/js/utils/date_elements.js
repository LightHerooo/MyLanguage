export class DateElements {
    year;
    month;
    day;
    hour;
    minute;
    second;

    constructor(dateObject) {
        this.year = dateObject.getFullYear().toString();

        if (dateObject.getMonth() + 1 < 10) {
            this.month = "0" + (dateObject.getMonth() + 1);
        } else {
            this.month = (dateObject.getMonth() + 1).toString();
        }

        if (dateObject.getDate() < 10) {
            this.day = "0" + dateObject.getDate();
        } else {
            this.day = dateObject.getDate().toString();
        }

        this.hour = dateObject.getHours().toString();

        if (dateObject.getMinutes() < 10) {
            this.minute = "0" + (dateObject.getMinutes());
        } else {
            this.minute = (dateObject.getMinutes()).toString();
        }

        if (dateObject.getSeconds() < 10) {
            this.second = "0" + (dateObject.getSeconds());
        } else {
            this.second = (dateObject.getSeconds()).toString();
        }
    }

    getDateStr() {
        return `${this.day}.${this.month}.${this.year}`;
    }

    getDateWithTimeStr() {
        return `${this.day}.${this.month}.${this.year} (${this.hour}:${this.minute})`;
    }

    getDatabaseDateStr() {
        return `${this.year}-${this.month}-${this.day}`;
    }
}