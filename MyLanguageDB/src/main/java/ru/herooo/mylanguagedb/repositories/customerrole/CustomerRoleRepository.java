package ru.herooo.mylanguagedb.repositories.customerrole;

import java.util.Optional;

public interface CustomerRoleRepository<T> {

    Optional<T> find(CustomerRoles customerRoles);
}
