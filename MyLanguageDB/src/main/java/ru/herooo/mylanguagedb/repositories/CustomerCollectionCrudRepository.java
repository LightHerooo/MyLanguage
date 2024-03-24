package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.types.CustomerCollectionsStatistic;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerCollectionCrudRepository extends CrudRepository<CustomerCollection, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_customer_collections_for_author(" +
            ":title, :lang_code, :customer_id, :is_active_for_author)")
    List<CustomerCollection> findAllForAuthor(@Param("title") String title,
                                              @Param("lang_code") String langCode,
                                              @Param("customer_id") Long customerId,
                                              @Param("is_active_for_author") Boolean isActiveForAuthor);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_customer_collections_for_author(NULL, NULL, :customer_id, :is_active_for_author)")
    Optional<Long> count(@Param("customer_id") Long customerId,
                         @Param("is_active_for_author") Boolean isActiveForAuthor);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_customer_collections_for_author(" +
            ":title, :lang_code, :customer_id, :is_active_for_author, " +
            ":number_of_items, :last_collection_id_on_previous_page)")
    List<CustomerCollection> findAllForAuthor(@Param("title") String title,
                                              @Param("lang_code") String langCode,
                                              @Param("customer_id") Long customerId,
                                              @Param("is_active_for_author") Boolean isActiveForAuthor,
                                              @Param("number_of_items") Long numberOfItems,
                                              @Param("last_collection_id_on_previous_page") Long lastCollectionIdOnPreviousPage);

    @Query(nativeQuery = true, value =
            "SELECT ccwls.lang_code AS langCode, " +
                    "ccwls.number_of_collections AS numberOfCollections " +
            "FROM get_customer_collections_statistics(:customer_id) ccwls")
    List<CustomerCollectionsStatistic> findStatistics(
            @Param("customer_id") Long customerId);

    Optional<CustomerCollection> findByCustomerAndTitleIgnoreCase(Customer customer, String title);
}
