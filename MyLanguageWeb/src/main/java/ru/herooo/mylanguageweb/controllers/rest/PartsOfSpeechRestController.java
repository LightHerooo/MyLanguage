package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.services.PartOfSpeechService;

import java.util.List;

@RestController
@RequestMapping("/api/parts_of_speech")
public class PartsOfSpeechRestController {

    private PartOfSpeechService PART_OF_SPEECH_SERVICE;

    @Autowired
    public PartsOfSpeechRestController(PartOfSpeechService partOfSpeechService) {
        this.PART_OF_SPEECH_SERVICE = partOfSpeechService;
    }

    @GetMapping()
    public ResponseEntity<?> getAll() {
        List<PartOfSpeech> partsOfSpeech = PART_OF_SPEECH_SERVICE.findAll();
        if (partsOfSpeech != null && partsOfSpeech.size() > 0) {
            return ResponseEntity.ok(partsOfSpeech);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Части речи не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        PartOfSpeech partOfSpeech = PART_OF_SPEECH_SERVICE.findByCode(code);
        if (partOfSpeech != null) {
            return ResponseEntity.ok(partOfSpeech);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Часть речи с кодом '%s' не найдена.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
