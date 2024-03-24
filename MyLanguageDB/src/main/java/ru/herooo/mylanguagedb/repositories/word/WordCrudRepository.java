package ru.herooo.mylanguagedb.repositories.word;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.types.WordsStatistic;

import java.util.List;
import java.util.Optional;

public interface WordCrudRepository extends CrudRepository<Word, Long>, WordRepository<Word> {
    Optional<Word> findFirstByTitleIgnoreCaseAndLang(String title, Lang lang);

    @Procedure("delete_words_unclaimed")
    void deleteAllUnclaimed();

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_words" +
                    "(:title, :word_status_code, :language_code)")
    Optional<Long> count(@Param("title") String title,
               @Param("word_status_code") String wordStatusCode,
               @Param("language_code") String languageCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_random(:lang_code, :count)")
    List<Word> findListRandom(@Param("lang_code") String langCode,
                              @Param("count") Long count);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_words_by_title_in_different_langs(:title, :word_status_code)")
    List<Word> findListByTitleInDifferentLangs(@Param("title") String title,
                                               @Param("word_status_code") String wordStatusCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words" +
                    "(:title, :word_status_code, :lang_code, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAll(@Param("title") String title,
                       @Param("word_status_code") String wordStatusCode,
                       @Param("lang_code") String langCode,
                       @Param("number_of_words") Long numberOfWords,
                       @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_customer" +
                    "(:title, :word_status_code, :lang_code, :customer_id, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAllCustomer(@Param("title") String title,
                               @Param("word_status_code") String wordStatusCode,
                               @Param("lang_code") String langCode,
                               @Param("customer_id") Long customerId,
                               @Param("number_of_words") Long numberOfWords,
                               @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT wss.word_status_code AS wordStatusCode, " +
                            "wss.number_of_words AS numberOfWords " +
                    "FROM get_words_statistics() wss")
    List<WordsStatistic> findWordsStatistics();

    @Query(nativeQuery = true,
            value = "SELECT wss.word_status_code AS wordStatusCode, " +
                    "wss.number_of_words AS numberOfWords " +
                    "FROM get_words_statistics(:customer_id) wss")
    List<WordsStatistic> findWordsStatistics(@Param("customer_id") Long customerId);
}
