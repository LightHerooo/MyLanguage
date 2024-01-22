package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;

@Repository
public interface CustomerCollectionCrudRepository extends CrudRepository<CustomerCollection, Long> {
    CustomerCollection findById(long id);
    CustomerCollection findByKey(String key);
    List<CustomerCollection> findAllByCustomerOrderById(Customer customer);
    CustomerCollection findByCustomerAndTitleIgnoreCase(Customer customer, String title);
    CustomerCollection findByCustomerAndKey(Customer customer, String key);

    long countByCustomer(Customer customer);
    long countByCustomerAndLang(Customer customer, Lang lang);
}
