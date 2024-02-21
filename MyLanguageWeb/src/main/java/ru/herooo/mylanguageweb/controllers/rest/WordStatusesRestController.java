package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatus.WordStatusResponseDTO;
import ru.herooo.mylanguageweb.services.WordStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/word_statuses")
public class WordStatusesRestController {
    private final WordStatusService WORD_STATUS_SERVICE;
    private final WordStatusMapping WORD_STATUS_MAPPING;

    @Autowired
    public WordStatusesRestController(WordStatusService wordStatusService,
                                      WordStatusMapping wordStatusMapping) {
        this.WORD_STATUS_SERVICE = wordStatusService;
        this.WORD_STATUS_MAPPING = wordStatusMapping;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<WordStatus> wordStatuses = WORD_STATUS_SERVICE.findAll();
        if (wordStatuses != null && wordStatuses.size() > 0) {
            List<WordStatusResponseDTO> responseDTOs =
                    wordStatuses.stream().map(WORD_STATUS_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Статусы слов не найдены");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> find(@RequestParam("code") String code) {
        WordStatus wordStatus = WORD_STATUS_SERVICE.find(code);
        if (wordStatus != null) {
            WordStatusResponseDTO dto = WORD_STATUS_MAPPING.mapToResponseDTO(wordStatus);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Статус слова с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
