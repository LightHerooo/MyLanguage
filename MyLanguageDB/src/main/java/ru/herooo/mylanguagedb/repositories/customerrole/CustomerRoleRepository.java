package ru.herooo.mylanguagedb.repositories.customerrole;

import ru.herooo.mylanguagedb.entities.CustomerRole;

public interface CustomerRoleRepository<T> {

    T findById(CustomerRoles customerRoles);
}
