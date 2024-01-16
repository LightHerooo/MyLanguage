export class GlobalCookie {
    NAME;
    OPTIONS;
    constructor(name, options = {}) {
        this.NAME = name;
        this.OPTIONS = options;
    }
}

export class GlobalCookies {
    AUTH_ID = new GlobalCookie(
        "auth_id",
        {
            'max-age': 7 * 24 * 60 * 60
        });
}