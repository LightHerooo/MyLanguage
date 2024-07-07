package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordStatusHistoryCrudRepository extends CrudRepository<WordStatusHistory, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_word_status_histories_words_with_current_status(:title, :lang_code, :word_status_code, " +
            ":customer_id, :number_of_items, :last_word_status_history_id_on_previous_page)")
    List<WordStatusHistory> findAllWordsWithCurrentStatus(@Param("title") String title,
                                                          @Param("lang_code") String langCode,
                                                          @Param("word_status_code") String wordStatusCode,
                                                          @Param("customer_id") Long customerId,
                                                          @Param("number_of_items") Long numberOfItems,
                                                          @Param("last_word_status_history_id_on_previous_page")
                                                          Long lastWordStatusHistoryIdOnPreviousPage);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_word_status_histories_word_changes_history(:word_id)")
    List<WordStatusHistory> findAllWordChangesHistory(@Param("word_id") Long wordId);



    @Query(value =
            "FROM WordStatusHistory wsh " +
            "WHERE wsh.word.id = :word_id " +
            "AND wsh.dateOfEnd IS NULL")
    Optional<WordStatusHistory> findCurrent(@Param("word_id") Long wordId);



    @Procedure("add_word_status_to_word")
    void addWordStatusToWord(Long wordId, String wordStatusCode);
}
