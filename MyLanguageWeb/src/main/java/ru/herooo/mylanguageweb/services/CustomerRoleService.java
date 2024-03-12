package ru.herooo.mylanguageweb.services;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoleCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;

import java.util.List;

@Service
public class CustomerRoleService {

    private final CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY;

    public CustomerRoleService(CustomerRoleCrudRepository customerRoleCrudRepository) {
        this.CUSTOMER_ROLE_CRUD_REPOSITORY = customerRoleCrudRepository;
    }

    public List<CustomerRole> findAll() {
        return CUSTOMER_ROLE_CRUD_REPOSITORY.findAll();
    }

    public CustomerRole find(CustomerRoles role) {
        return CUSTOMER_ROLE_CRUD_REPOSITORY.find(role).orElse(null);
    }

    public CustomerRole find(String code) {
        return CUSTOMER_ROLE_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }
}
