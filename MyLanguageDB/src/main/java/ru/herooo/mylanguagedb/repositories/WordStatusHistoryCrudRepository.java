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
    @Query("FROM WordStatusHistory wsh " +
            "WHERE wsh.word = :word " +
            "AND wsh.dateOfEnd IS NULL")
    WordStatusHistory findCurrentByWord(Word word);

    @Procedure("add_word_status_to_word")
    void addWordStatusToWord(Long wordId, String wordStatusCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_current_word_status_history_to_word(:word_id)")
    WordStatusHistory getCurrentWordStatusHistoryToWord(@Param("word_id") Long wordId);

    @Procedure("add_word_status_to_words_without_status")
    void addWordStatusToWordsWithoutStatus(String wordStatusCode);

    List<WordStatusHistory> findByWordOrderByDateOfStartDesc(Word word);
}
