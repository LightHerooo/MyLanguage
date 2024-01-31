class WordStatus {
    ID;
    CODE;

    constructor(id, code) {
        this.ID = id;
        this.CODE = code;
    }
}

export class WordStatuses {
    ACTIVE = new WordStatus(1, "active");
    UNCLAIMED = new WordStatus(2, "unclaimed");
    NEW = new WordStatus(3, "new");
    BLOCKED = new WordStatus(4, "blocked");
}