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
import java.util.Optional;

@Repository
public interface WordInCollectionCrudRepository extends CrudRepository<WordInCollection, Long>, WordInCollectionRepository<WordInCollection> {
    Optional<WordInCollection> findByWordAndCustomerCollection(Word word, CustomerCollection customerCollection);

    @Procedure("delete_words_in_collections_without_active_status")
    void deleteAllWithoutActiveStatus();

    @Query(nativeQuery = true,
        value = "SELECT * FROM get_words_in_collection" +
                "(:title, :collection_id)")
    List<WordInCollection> findAll(
            @Param("title") String title,
            @Param("collection_id") Long collectionId);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_in_collection" +
                    "(:title, :collection_id, :number_of_words," +
                    ":last_word_in_collection_id_on_previous_page)")
    List<WordInCollection> findAll(
            @Param("title") String title,
            @Param("collection_id") Long collectionId,
            @Param("number_of_words") Long numberOfWords,
            @Param("last_word_in_collection_id_on_previous_page") Long lastWordInCollectionIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_words_in_collection(NULL, :collection_id)")
    Optional<Long> count(@Param("collection_id") Long collectionId);
}
