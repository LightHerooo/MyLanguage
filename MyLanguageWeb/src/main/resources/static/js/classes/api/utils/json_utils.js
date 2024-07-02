export class JSONUtils {
    #jsonReplacer(key, value) {
        if (typeof value === 'bigint') {
            return value.toString() + 'n';
        } else {
            return value;
        }
    }
    #jsonReviver(key, value) {
        if (typeof value === 'string' && /^\d+n$/.test(value)) {
            return BigInt(value.slice(0, -1));
        }
        return value;
    }

    parse(jsonStr) {
        return JSON.parse(jsonStr, this.#jsonReviver)
    }

    stringify(value) {
        return JSON.stringify(value, this.#jsonReplacer);
    }

    createJsonStrEmpty() {
        return JSON.stringify({}, this.#jsonReplacer);
    }
}