package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Word;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WordCrudRepository extends CrudRepository<Word, Long> {
    List<Word> findAll();

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_words_after_filter(NULL, :word_status_code, NULL, NULL)")
    long countByWordStatusCode(@Param("word_status_code") String wordStatusCode);

    Word findById(long id);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_after_filter" +
                    "(:title, :word_status_code, :part_of_speech_code, :language_code)")
    List<Word> findAfterFilter(@Param("title") String title,
                               @Param("word_status_code") String wordStatusCode,
                               @Param("part_of_speech_code") String partOfSpeechCode,
                               @Param("language_code") String languageCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_words_after_filter_pagination" +
                    "(:title, :word_status_code, :part_of_speech_code, :lang_code, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findAfterFilterWithPagination(@Param("title") String title,
                                             @Param("word_status_code") String wordStatusCode,
                                             @Param("part_of_speech_code") String partOfSpeechCode,
                                             @Param("lang_code") String langCode,
                                             @Param("number_of_words") Long numberOfWords,
                                             @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);

    @Query(nativeQuery = true,
            value = "SELECT * FROM get_customer_words_after_filter_pagination" +
                    "(:title, :word_status_code, :part_of_speech_code, :lang_code, :customer_id, " +
                    ":number_of_words, :last_word_id_on_previous_page)")
    List<Word> findCustomerWordsAfterFilterWithPagination(@Param("title") String title,
                                                          @Param("word_status_code") String wordStatusCode,
                                                          @Param("part_of_speech_code") String partOfSpeechCode,
                                                          @Param("lang_code") String langCode,
                                                          @Param("customer_id") Long customerId,
                                                          @Param("number_of_words") Long numberOfWords,
                                                          @Param("last_word_id_on_previous_page") Long lastWordIdOnPreviousPage);
    long countByDateOfCreate(LocalDateTime date);

    Word findFirstByTitleIgnoreCase(String title);

    @Procedure("delete_all_unclaimed_words")
    void deleteAllUnclaimedWords();

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_customer_words_after_filter" +
                    "(NULL, :word_status_code, NULL, NULL, :customer_id)")
    long countByCustomerIdAndWordStatusCode(@Param("customer_id") Long customerId,
                                            @Param("word_status_code") String wordStatusCode);
}
