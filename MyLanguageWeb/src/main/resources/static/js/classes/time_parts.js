export class TimeParts {
    #hours;
    #minutes;
    #seconds;
    #milliseconds;

    constructor(milliseconds) {
        this.#milliseconds = milliseconds;
        this.#seconds = milliseconds / 1000n;
        this.#minutes = this.#seconds / 60n;
        this.#hours = this.#minutes / 60n;
    }

    getTimeStr(doNeedHours, doNeedMinutes, doNeedSeconds, doNeedMilliseconds) {
        let timePartsArr = [];
        if (doNeedHours === true) {
            let hours = this.#hours;
            if (hours <= 9n) {
                timePartsArr.push("0" + hours);
            } else {
                timePartsArr.push(hours);
            }
        }

        if (doNeedMinutes === true) {
            let minutes = this.#minutes;
            if (doNeedHours === true) {
                minutes = this.#minutes % 60n;
            }

            if (minutes <= 9n) {
                timePartsArr.push("0" + minutes)
            } else {
                timePartsArr.push(minutes);
            }
        }

        if (doNeedSeconds === true) {
            let seconds = this.#seconds;
            if (doNeedMinutes === true) {
                seconds = this.#seconds % 60n;
            }

            if (seconds <= 9n) {
                timePartsArr.push("0" + seconds)
            } else {
                timePartsArr.push(seconds);
            }
        }

        if (doNeedMilliseconds === true) {
            let milliseconds = this.#milliseconds;
            if (doNeedSeconds === true) {
                milliseconds = milliseconds % 1000n;
            }

            let zeros = "";
            if (milliseconds <= 999n) {
                zeros = "000";
            } else if (milliseconds <= 99n) {
                zeros = "00";
            } else if (milliseconds <= 9n) {
                zeros = "0";
            }

            if (zeros) {
                timePartsArr.push(zeros + milliseconds);
            } else {
                timePartsArr.push(milliseconds);
            }
        }

        let timeStr = "";
        if (timePartsArr.length > 0) {
            for (let timePart of timePartsArr) {
                timeStr += timePart + ":";
            }

            timeStr = timeStr.substring(0, timeStr.length - 1);
        } else {
            timeStr = "NaN";
        }

        return timeStr;
    }
}