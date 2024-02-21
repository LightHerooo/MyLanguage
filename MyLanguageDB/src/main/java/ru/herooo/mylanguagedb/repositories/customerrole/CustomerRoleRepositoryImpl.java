package ru.herooo.mylanguagedb.repositories.customerrole;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.herooo.mylanguagedb.entities.CustomerRole;

public class CustomerRoleRepositoryImpl implements CustomerRoleRepository<CustomerRole> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public CustomerRole find(CustomerRoles customerRoles) {
        return em.createQuery("from CustomerRole cr where cr.id = :customerRoleId", CustomerRole.class)
                .setParameter("customerRoleId", customerRoles.getId()).
                getResultStream().findAny().orElse(null);
    }
}
