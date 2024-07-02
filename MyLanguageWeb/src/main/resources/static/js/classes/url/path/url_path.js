const _HOSTNAME = "http://localhost:8080";

export class UrlPath {
    #path;

    constructor(path) {
        this.#path = path;
    }

    getPath() {
        return this.#path;
    }

    replace(doNeedToSaveHistory) {
        let path = this.#path;
        if (path) {
            let finalUrlStr = `${_HOSTNAME}${path}`;
            if (doNeedToSaveHistory) {
                window.location = finalUrlStr;
            } else {
                window.location.replace(finalUrlStr);
            }
        } else {
            throw new Error("Variable \'path\' is null.");
        }
    }
}