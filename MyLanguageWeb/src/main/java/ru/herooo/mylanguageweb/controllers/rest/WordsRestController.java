package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.repositories.WordCrudRepository;

import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordsRestController {
    private WordCrudRepository wcr;

    @Autowired
    public WordsRestController(WordCrudRepository wcr) {
        this.wcr = wcr;
    }

    @GetMapping()
    public List<Word> getAllWords() {
        return wcr.findAll();
    }

    @GetMapping("/filtered")
    public List<Word> getFilteredWords(
            @RequestParam("title") String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "language_code", required = false) String languageCode
    ) {
        return wcr.findAfterFilter(title, wordStatusCode, partOfSpeechCode, languageCode);
    }

    @GetMapping("/filtered_pagination")
    public List<Word> getFilteredWordsWithPagination(
            @RequestParam("title") String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "last_word_id_before_filter", required = false) Long lastWordIdBeforeFilter
    ) {
        numberOfWords = numberOfWords == null ? 0 : numberOfWords;
        lastWordIdBeforeFilter = lastWordIdBeforeFilter == null ? 0 : lastWordIdBeforeFilter;
        return wcr.findAfterFilterWithPagination(title, wordStatusCode, partOfSpeechCode, langCode,
                numberOfWords, lastWordIdBeforeFilter);
    }
}
