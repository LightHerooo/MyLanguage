package ru.herooo.mylanguagedb.repositories.word;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.word.types.WordsStatistic;

import java.util.List;
import java.util.Optional;

public interface WordCrudRepository extends CrudRepository<Word, Long>, WordRepository<Word> {
    @Query(nativeQuery = true, value =
            "SELECT * FROM get_words(:title, :lang_code, :word_status_code, :customer_id," +
                ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAll(@Param("title") String title,
                       @Param("lang_code") String langCode,
                       @Param("word_status_code") String wordStatusCode,
                       @Param("customer_id") Long customerId,
                       @Param("number_of_words") Long numberOfWords,
                       @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_words_random(:lang_code, :number_of_items)")
    List<Word> findAllRandom(@Param("lang_code") String langCode,
                             @Param("number_of_items") Long numberOfItems);

    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_words_with_current_title(:title, :word_status_code)")
    List<Word> findAllWithCurrentTitle(@Param("title") String title,
                                       @Param("word_status_code") String wordStatusCode);

    @Query(nativeQuery = true, value =
            "SELECT wss.word_status_code AS wordStatusCode " +
                    ", wss.number_of_words AS numberOfWords " +
                    "FROM get_words_statistic() wss")
    List<WordsStatistic> findWordsStatistic();

    @Query(nativeQuery = true, value =
            "SELECT wss.word_status_code AS wordStatusCode " +
                    ", wss.number_of_words AS numberOfWords " +
                    "FROM get_words_statistic(:customer_id) wss")
    List<WordsStatistic> findWordsCustomerStatistic(@Param("customer_id") Long customerId);



    Optional<Word> findFirstByTitleIgnoreCaseAndLang(String title, Lang lang);



    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_words(:title, :lang_code, :word_status_code)")
    Optional<Long> count(@Param("title") String title,
                         @Param("lang_code") String langCode,
                         @Param("word_status_code") String wordStatusCode);



    @Procedure("delete_words_unclaimed")
    void deleteAllUnclaimed();
}
