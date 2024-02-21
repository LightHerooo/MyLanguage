package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.List;

@RestController
@RequestMapping("/api/langs")
public class LangsRestController {
    private final LangService LANG_SERVICE;
    private final LangMapping LANG_MAPPING;

    @Autowired
    public LangsRestController(LangService langService,
                               LangMapping langMapping) {
        this.LANG_SERVICE = langService;
        this.LANG_MAPPING = langMapping;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Lang> langs = LANG_SERVICE.findAll();
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Языки не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/actives")
    public ResponseEntity<?> getAllActives() {
        List<Lang> langs = LANG_SERVICE.findAll(true);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Активных языков не найдено.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> find(@RequestParam("code") String code) {
        Lang lang = LANG_SERVICE.find(code);
        if (lang != null) {
            LangResponseDTO dto = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Язык с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_active_by_code")
    public ResponseEntity<?> validateIsActive(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(code);
        if (lang.isActive()) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык доступен.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык недоступен.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
