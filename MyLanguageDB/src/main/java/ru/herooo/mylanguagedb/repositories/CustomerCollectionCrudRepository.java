package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;

@Repository
public interface CustomerCollectionCrudRepository extends CrudRepository<CustomerCollection, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_customer_collections(:customer_id)")
    List<CustomerCollection> findAll(@Param("customer_id") Long customerId);

    CustomerCollection findById(long id);
    CustomerCollection findByKey(String key);
    CustomerCollection findByCustomerAndTitleIgnoreCase(Customer customer, String title);
    CustomerCollection findByCustomerAndKey(Customer customer, String key);
    long countByCustomer(Customer customer);
    long countByCustomerAndLang(Customer customer, Lang lang);
}
