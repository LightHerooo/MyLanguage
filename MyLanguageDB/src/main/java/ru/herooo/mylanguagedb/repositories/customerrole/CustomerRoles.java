package ru.herooo.mylanguagedb.repositories.customerrole;

public enum CustomerRoles {

    CUSTOMER (1),
    ADMIN (2),
    MODERATOR (3);


    public final long ID;
    CustomerRoles(long id) {
        this.ID = id;
    }
}
