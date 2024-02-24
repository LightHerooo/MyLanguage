export class CustomTimerTicker {
    #customTimer;
    #tick;
    #tickFunction;
    #milliseconds;

    constructor(customTimer, startMilliseconds) {
        this.#customTimer = customTimer;
        this.#tick = BigInt(customTimer.getTimeout());
        this.#tickFunction = customTimer.getHandler();

        this.#milliseconds = BigInt(startMilliseconds);
    }

    getMilliseconds() {
        return this.#milliseconds;
    }

    addMilliseconds(milliseconds) {
        this.#milliseconds += BigInt(milliseconds);
    }

    start() {
        this.stop();

        let thisTicker = this;
        this.#customTimer.setHandler(function () {
            thisTicker.addMilliseconds(thisTicker.#tick);
            thisTicker.#tickFunction();
        });

        this.#customTimer.startInterval();
    }

    stop() {
        this.#customTimer.stopInterval();
    }
}