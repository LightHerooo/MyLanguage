package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;

import java.util.List;

@Repository
public interface WordStatusHistoryCrudRepository extends CrudRepository<WordStatusHistory, Long> {

    @Procedure("add_word_status_to_word")
    void addWordStatusToWord(Long wordId, String wordStatusCode);

    @Procedure("add_word_status_to_words_without_status")
    void addWordStatusToWordsWithoutStatus(String wordStatusCode);

    @Query(value =
            "FROM WordStatusHistory wsh " +
            "WHERE wsh.word.id = :word_id " +
            "ORDER BY wsh.dateOfStart DESC")
    List<WordStatusHistory> findList(@Param("word_id") Long wordId);

    @Query(value =
            "FROM WordStatusHistory wsh " +
            "WHERE wsh.word.id = :word_id " +
            "AND wsh.dateOfEnd IS NULL")
    WordStatusHistory findCurrent(@Param("word_id") Long wordId);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_current_word_status_history_to_word(:word_id)")
    WordStatusHistory getCurrentWordStatusHistoryToWord(@Param("word_id") Long wordId);
}
