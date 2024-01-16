import {
    GlobalCookie
} from "../classes/global_cookies.js";

export function getGlobalCookie(globalCookie) {
    if (globalCookie instanceof GlobalCookie) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + globalCookie.NAME.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    return undefined;
}

export function setGlobalCookie(globalCookie, value) {
    if (globalCookie instanceof GlobalCookie) {
        setCookie(globalCookie.NAME, value, globalCookie.OPTIONS);
    }
}

export function deleteGlobalCookie(globalCookie) {
    if (globalCookie instanceof GlobalCookie) {
        setCookie(globalCookie.NAME, "", {'max-age': -1});
    }
}

function setCookie(name, value, options = {}) {
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


