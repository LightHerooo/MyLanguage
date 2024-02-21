package ru.herooo.mylanguagedb.repositories.wordincollection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;

import java.util.List;

@Repository
public interface WordInCollectionCrudRepository extends CrudRepository<WordInCollection, Long>, WordInCollectionRepository<WordInCollection> {
    WordInCollection findById(long id);
    WordInCollection findByWordAndCustomerCollection(Word word, CustomerCollection customerCollection);

    @Procedure("delete_inactive_words_in_collections")
    void deleteInactiveWordsInCollections();

    @Query(nativeQuery = true,
        value = "SELECT * FROM get_words_in_collection_after_filter" +
                "(:title, :customer_collection_key)")
    List<WordInCollection> findAll(
            @Param("title") String title,
            @Param("customer_collection_key") String customerCollectionKey);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_in_collection_after_filter_pagination" +
                    "(:title, :customer_collection_key, :number_of_words," +
                    ":last_word_in_collection_id_on_previous_page)")
    List<WordInCollection> findAll(
            @Param("title") String title,
            @Param("customer_collection_key") String customerCollectionKey,
            @Param("number_of_words") Long numberOfWords,
            @Param("last_word_in_collection_id_on_previous_page") Long lastWordInCollectionIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_words_in_collection_after_filter(NULL, :collection_key)")
    long count(@Param("collection_key") String collectionKey);
}
