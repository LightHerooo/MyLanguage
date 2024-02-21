package ru.herooo.mylanguagedb.repositories.lang;

public enum Langs {
    RU (1),
    EN (2),
    PL(3),
    UA(4),
    DE(5),
    FR(6),
    ES(7),
    IT(8),
    TR(9)

    ;

    private final long id;

    Langs(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
