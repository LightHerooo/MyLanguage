package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.partofspeech.PartOfSpeechMapping;
import ru.herooo.mylanguageweb.dto.partofspeech.PartOfSpeechResponseDTO;
import ru.herooo.mylanguageweb.services.PartOfSpeechService;

import java.util.List;

@RestController
@RequestMapping("/api/parts_of_speech")
public class PartsOfSpeechRestController {

    private final PartOfSpeechService PART_OF_SPEECH_SERVICE;
    private final PartOfSpeechMapping PART_OF_SPEECH_MAPPING;

    @Autowired
    public PartsOfSpeechRestController(PartOfSpeechService partOfSpeechService,
                                       PartOfSpeechMapping partOfSpeechMapping) {
        this.PART_OF_SPEECH_SERVICE = partOfSpeechService;
        this.PART_OF_SPEECH_MAPPING = partOfSpeechMapping;
    }

    @GetMapping()
    public ResponseEntity<?> getAll() {
        List<PartOfSpeech> partsOfSpeech = PART_OF_SPEECH_SERVICE.findAll();
        if (partsOfSpeech != null && partsOfSpeech.size() > 0) {
            List<PartOfSpeechResponseDTO> responseDTOs =
                    partsOfSpeech.stream().map(PART_OF_SPEECH_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Части речи не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        PartOfSpeech partOfSpeech = PART_OF_SPEECH_SERVICE.findByCode(code);
        if (partOfSpeech != null) {
            PartOfSpeechResponseDTO dto = PART_OF_SPEECH_MAPPING.mapToResponseDTO(partOfSpeech);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Часть речи с кодом '%s' не найдена.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
