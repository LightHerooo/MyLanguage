package ru.herooo.mylanguagedb.repositories.lang;

public enum Langs {
    RU (1),
    EN (2),

    ;

    private final long id;

    Langs(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
