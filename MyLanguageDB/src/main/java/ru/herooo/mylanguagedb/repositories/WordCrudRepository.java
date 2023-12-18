package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Word;

import java.util.List;
import java.util.Optional;

public interface WordCrudRepository extends CrudRepository<Word, Long> {
    List<Word> findAll();
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
                    ":number_of_words, :last_word_id_before_filter)")
    List<Word> findAfterFilterWithPagination(@Param("title") String title,
                                             @Param("word_status_code") String wordStatusCode,
                                             @Param("part_of_speech_code") String partOfSpeechCode,
                                             @Param("lang_code") String langCode,
                                             @Param("number_of_words") Long numberOfWords,
                                             @Param("last_word_id_before_filter") Long lastWordIdBeforeFilter);
}
