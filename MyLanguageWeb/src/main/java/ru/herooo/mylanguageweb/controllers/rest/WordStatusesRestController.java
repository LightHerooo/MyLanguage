package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.services.WordStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/word_statuses")
public class WordStatusesRestController {
    private final WordStatusService WORD_STATUS_SERVICE;
    @Autowired
    public WordStatusesRestController(WordStatusService wordStatusService) {
        this.WORD_STATUS_SERVICE = wordStatusService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<WordStatus> wordStatuses = WORD_STATUS_SERVICE.findAll();
        if (wordStatuses != null && wordStatuses.size() > 0) {
            return ResponseEntity.ok(wordStatuses);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Статусы слов не найдены");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        WordStatus wordStatus = WORD_STATUS_SERVICE.findByCode(code);
        if (wordStatus != null) {
            return ResponseEntity.ok(wordStatus);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Статус слова с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
