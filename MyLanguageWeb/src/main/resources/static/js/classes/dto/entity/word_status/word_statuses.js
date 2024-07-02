export class WordStatuses {
    ACTIVE = new WordStatus(1n, "active");
    UNCLAIMED = new WordStatus(2n, "unclaimed");
    NEW = new WordStatus(3n, "new");
    BLOCKED = new WordStatus(4n, "blocked");
}

class WordStatus {
    ID;
    CODE;

    constructor(id, code) {
        this.ID = id;
        this.CODE = code;
    }
}