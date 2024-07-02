package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.customer_collection.types.CustomerCollectionsStatistic;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerCollectionCrudRepository extends CrudRepository<CustomerCollection, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_customer_collections(:title, :lang_code, :is_active_for_author, " +
                ":customer_id, :number_of_items, :last_customer_collection_id_on_previous_page)")
    List<CustomerCollection> findAll(@Param("title") String title,
                                     @Param("lang_code") String langCode,
                                     @Param("is_active_for_author") Boolean isActiveForAuthor,
                                     @Param("customer_id") Long customerId,
                                     @Param("number_of_items") Long numberOfItems,
                                     @Param("last_customer_collection_id_on_previous_page") Long lastCustomerCollectionIdOnPreviousPage);

    @Query(nativeQuery = true, value =
            "SELECT ccscs.lang_code AS langCode " +
            ", ccscs.number_of_collections AS numberOfCollections " +
            "FROM get_customer_collections_customer_statistic(:customer_id) ccscs")
    List<CustomerCollectionsStatistic> findCustomerStatistic(@Param("customer_id") Long customerId);



    Optional<CustomerCollection> findByCustomerAndTitleIgnoreCase(Customer customer, String title);



    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_customer_collections(NULL, NULL, :is_active_for_author, :customer_id)")
    Optional<Long> countForAuthor(@Param("is_active_for_author") Boolean isActiveForAuthor,
                                  @Param("customer_id") Long customerId);
}
