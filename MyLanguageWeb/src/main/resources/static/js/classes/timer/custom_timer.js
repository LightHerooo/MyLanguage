export class CustomTimer {
    #handler;
    #timeout = 1000;

    #id;
    #isActive = false;

    getHandler() {
        return this.#handler;
    }

    setHandler(handler) {
        this.#handler = handler;
    }

    getTimeout() {
        return this.#timeout;
    }

    setTimeout(timeout) {
        this.#timeout = timeout;
    }

    getIsActive() {
        return this.#isActive;
    }


    stop() {
        this.#isActive = false;

        clearTimeout(this.#id);
    }

    start() {
        this.stop();

        let self = this;
        this.#id = setTimeout(async function() {
            self.#isActive = true;

            let handler = self.#handler;
            if (handler) {
                await handler();
            }
        }, this.#timeout);
    }
}