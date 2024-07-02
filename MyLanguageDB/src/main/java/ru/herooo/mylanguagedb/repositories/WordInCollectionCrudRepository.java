package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordInCollectionCrudRepository extends CrudRepository<WordInCollection, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_words_in_collection(:customer_collection_id, :title, :number_of_words," +
                ":last_word_in_collection_id_on_previous_page)")
    List<WordInCollection> findAll(
            @Param("customer_collection_id") Long customerCollectionId,
            @Param("title") String title,
            @Param("number_of_words") Long numberOfWords,
            @Param("last_word_in_collection_id_on_previous_page") Long lastWordInCollectionIdOnPreviousPage);



    Optional<WordInCollection> findByWordAndCustomerCollection(Word word, CustomerCollection customerCollection);



    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_words_in_collection(:customer_collection_id)")
    Optional<Long> count(@Param("customer_collection_id") Long customerCollectionId);



    @Procedure("delete_words_in_collections_without_active_status")
    void deleteAllWithoutActiveStatus();
}
