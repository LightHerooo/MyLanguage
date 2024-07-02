export class UrlUtils {
    getPathVariable() {
        return this.getPathVariableByPath(window.location.href);
    }

    getPathVariableByPath(path) {
        let value;
        let lastSlashIndex = path.lastIndexOf("/");
        if (lastSlashIndex > -1) {
            value = path.substring(lastSlashIndex + 1);
        }

        return value;
    }
}