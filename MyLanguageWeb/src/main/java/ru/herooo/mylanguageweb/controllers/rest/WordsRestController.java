package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguageweb.services.WordService;

import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordsRestController {
    private final WordService WORD_SERVICE;

    @Autowired
    public WordsRestController(WordService wordService) {
        this.WORD_SERVICE = wordService;
    }

    @GetMapping()
    public List<Word> getAll() {
        return WORD_SERVICE.findAll();
    }

    @GetMapping("/filtered")
    public ResponseEntity<?> getFiltered(
            @RequestParam("title") String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode) {

        return WORD_SERVICE.getResponseAfterFilter(title, wordStatusCode, partOfSpeechCode, langCode);
    }

    @GetMapping("/filtered_pagination")
    public ResponseEntity<?> getFilteredPagination(
            @RequestParam("title") String title,
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false,
                    defaultValue = "0") Long lastWordIdOnPreviousPage) {

        return WORD_SERVICE.getResponseAfterFilterWithPagination(title, wordStatusCode, partOfSpeechCode, langCode,
                numberOfWords, lastWordIdOnPreviousPage);
    }
}
