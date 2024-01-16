package ru.herooo.mylanguagedb.repositories.wordstatus;

public enum WordStatuses {

    ACTIVE(1, "active"),
    UNCLAIMED(2, "unclaimed"),
    NEW(3, "new"),
    BLOCKED(5, "blocked")
    ;

    public final long ID;
    public final String TITLE;

    WordStatuses(long id, String title) {
        this.ID = id;
        this.TITLE = title;
    }
}
