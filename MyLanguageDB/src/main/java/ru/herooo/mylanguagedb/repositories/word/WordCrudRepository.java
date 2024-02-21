package ru.herooo.mylanguagedb.repositories.word;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.Word;

import java.util.List;

public interface WordCrudRepository extends CrudRepository<Word, Long>, WordRepository<Word> {
    Word findById(long id);
    Word findFirstByTitleIgnoreCaseAndLang(String title, Lang lang);

    @Procedure("delete_all_unclaimed_words")
    void deleteAllUnclaimedWords();

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_words_after_filter(NULL, :word_status_code, NULL)")
    long count(@Param("word_status_code") String wordStatusCode);

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_customer_words_after_filter" +
                    "(NULL, :word_status_code, NULL, :customer_id)")
    long count(@Param("customer_id") Long customerId,
               @Param("word_status_code") String wordStatusCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_random_words" +
                    "(:lang_code, :count)")
    List<Word> findListRandom(@Param("lang_code") String langCode,
                              @Param("count") Long count);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_after_filter" +
                    "(:title, :word_status_code, :language_code)")
    List<Word> findAllAfterFilter(@Param("title") String title,
                                  @Param("word_status_code") String wordStatusCode,
                                  @Param("language_code") String languageCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_after_filter_pagination" +
                    "(:title, :word_status_code, :lang_code, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAllAfterFilterWithPagination(@Param("title") String title,
                                                @Param("word_status_code") String wordStatusCode,
                                                @Param("lang_code") String langCode,
                                                @Param("number_of_words") Long numberOfWords,
                                                @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_customer_words_after_filter_pagination" +
                    "(:title, :word_status_code, :lang_code, :customer_id, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAllCustomerWordsAfterFilterWithPagination(@Param("title") String title,
                                                             @Param("word_status_code") String wordStatusCode,
                                                             @Param("lang_code") String langCode,
                                                             @Param("customer_id") Long customerId,
                                                             @Param("number_of_words") Long numberOfWords,
                                                             @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_with_current_status" +
                    "(:title, :word_status_code)")
    List<Word> findAllWithCurrentStatus(@Param("title") String title,
                                        @Param("word_status_code") String wordStatusCode);
}
