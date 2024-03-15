package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.types.CustomerCollectionsWithLangStatistic;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerCollectionCrudRepository extends CrudRepository<CustomerCollection, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_customer_collections(:customer_id)")
    List<CustomerCollection> findAll(@Param("customer_id") Long customerId);
    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_customer_collections(:customer_id)")
    Optional<Long> count(@Param("customer_id") Long customerId);

    @Query(nativeQuery = true, value =
            "SELECT ccwls.lang_code AS langCode, " +
                    "ccwls.number_of_collections AS numberOfCollections " +
            "FROM get_customer_collections_with_lang_statistics(:customer_id) ccwls")
    List<CustomerCollectionsWithLangStatistic> findCustomerCollectionsWithLangStatistics(
            @Param("customer_id") Long customerId);

    Optional<CustomerCollection> findByCustomerAndTitleIgnoreCase(Customer customer, String title);
}
