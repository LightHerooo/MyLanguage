export class CustomTimer {
    #id;
    timeout;
    handler;

    constructor(timeout, handler) {
        this.timeout = timeout;
        this.handler = handler;
    }

    stop() {
        clearTimeout(this.#id);
    }

    stopInterval() {
        clearInterval(this.#id);
    }

    start() {
        this.stop();

        this.#id = setTimeout(this.handler, this.timeout);
    }

    startInterval() {
        this.stopInterval();

        this.#id = setInterval(this.handler, this.timeout);
    }
}