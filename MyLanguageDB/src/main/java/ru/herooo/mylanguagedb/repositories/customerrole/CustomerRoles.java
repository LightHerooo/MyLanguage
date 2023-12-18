package ru.herooo.mylanguagedb.repositories.customerrole;

public enum CustomerRoles {

    CUSTOMER (1),
    ADMIN (2),
    MODERATOR (3);


    private long id;
    CustomerRoles(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
