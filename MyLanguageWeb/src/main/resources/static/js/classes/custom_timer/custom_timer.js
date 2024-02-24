export class CustomTimer {
    #id;
    #timeout;
    #handler;
    #isActive = false;

    setHandler(differentFunction) {
        let thisClass = this;

        this.#handler = async function () {
            thisClass.#isActive = true;
            await differentFunction();
        }
    }

    getHandler() {
        return this.#handler;
    }

    setTimeout(timeout) {
        this.#timeout = timeout;
    }

    getTimeout() {
        return this.#timeout;
    }

    getActive() {
        return this.#isActive;
    }

    stop() {
        // Меняем активность на FALSE (использовать флаг внутри handler, чтобы запретить дальнейшее выполнение)
        this.#isActive = false;
        clearTimeout(this.#id);
    }

    stopInterval() {
        // Меняем активность на FALSE (использовать флаг внутри handler, чтобы запретить дальнейшее выполнение)
        this.#isActive = false;
        clearInterval(this.#id);
    }

    start() {
        this.stop();
        this.#id = setTimeout(this.#handler, this.#timeout);
    }

    startInterval() {
        this.stopInterval();
        this.#id = setInterval(this.#handler, this.#timeout);
    }
}