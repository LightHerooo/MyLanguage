package ru.herooo.mylanguagedb.repositories.word;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguagedb.entities.Word;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WordCrudRepository extends CrudRepository<Word, Long>, WordRepository<Word> {
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

    Word findFirstByTitleIgnoreCaseAndLangAndPartOfSpeech(String title, Lang lang, PartOfSpeech partOfSpeech);

    @Procedure("delete_all_unclaimed_words")
    void deleteAllUnclaimedWords();

    @Query(nativeQuery = true,
            value = "SELECT COUNT(*) FROM get_customer_words_after_filter" +
                    "(NULL, :word_status_code, NULL, NULL, :customer_id)")
    long countByCustomerIdAndWordStatusCode(@Param("customer_id") Long customerId,
                                            @Param("word_status_code") String wordStatusCode);

    @Query(nativeQuery = true,
            value = "SELECT COUNT (*) FROM get_words_with_current_status_by_title_and_word_status_code" +
                    "(:title, :word_status_code)")
    long countWordsWithCurrentStatusByTitleAndWordStatusCode(@Param("title") String title,
                                                             @Param("word_status_code") String wordStatusCode);
}