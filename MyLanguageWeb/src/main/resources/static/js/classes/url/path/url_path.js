const _HOSTNAME = "http://localhost:8080/MyLanguage";

export class UrlPath {
    #path;

    constructor(path) {
        this.#path = path;
    }

    getPath() {
        return this.#path;
    }

    createFullPath() {
        let path = this.#path;
        return path
            ? `${_HOSTNAME}${path}`
            : _HOSTNAME;
    }

    replace(doNeedToSaveHistory) {
        let path = this.#path;
        if (path) {
            let fullPath = this.createFullPath();
            if (doNeedToSaveHistory) {
                window.location = fullPath;
            } else {
                window.location.replace(fullPath);
            }
        } else {
            throw new Error("Variable \'path\' is null");
        }
    }
}