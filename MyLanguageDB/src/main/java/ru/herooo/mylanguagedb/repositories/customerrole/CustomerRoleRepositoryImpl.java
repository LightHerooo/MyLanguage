package ru.herooo.mylanguagedb.repositories.customerrole;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.CustomerRole;

import java.util.Optional;

public class CustomerRoleRepositoryImpl implements CustomerRoleRepository<CustomerRole> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<CustomerRole> find(CustomerRoles customerRoles) {
        return em.createQuery("from CustomerRole cr where cr.id = :id", CustomerRole.class)
                .setParameter("id", customerRoles.ID).
                getResultStream().findAny();
    }
}
