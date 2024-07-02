package ru.herooo.mylanguagedb.repositories.customerrole;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.CustomerRole;

import java.util.List;
import java.util.Optional;

public interface CustomerRoleCrudRepository extends CrudRepository<CustomerRole, Long>, CustomerRoleRepository<CustomerRole> {
    List<CustomerRole> findAll();



    Optional<CustomerRole> findByCode(String code);
}
