export class GlobalCookies {
    AUTH_ID = new GlobalCookie(
        "auth_id",
        {
            'max-age': 7 * 24 * 60 * 60
        });
}

class GlobalCookie {
    #name;
    #options;
    constructor(name, options = {}) {
        this.#name = name;
        this.#options = options;
    }

    getValue() {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + this.#name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setValue(value) {
        this.#setCookie(this.#name, value, this.#options);
    }

    clearValue() {
        this.#setCookie(this.#name, "", {'max-age': -1});
    }

    #setCookie(name, value, options = {}) {
        options = {
            path: '/',
            // при необходимости добавьте другие значения по умолчанию
            ...options
        };

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }
}