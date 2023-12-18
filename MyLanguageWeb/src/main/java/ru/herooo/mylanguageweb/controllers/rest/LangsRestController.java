package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.List;

@RestController
@RequestMapping("/api/langs")
public class LangsRestController {

    private final LangService LANG_SERVICE;

    @Autowired
    public LangsRestController(LangService langService) {
        this.LANG_SERVICE = langService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Lang> langs = LANG_SERVICE.findAll();
        if (langs != null && langs.size() > 0) {
            return ResponseEntity.ok(langs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Языки не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        Lang lang = LANG_SERVICE.findByCode(code);
        if (lang != null) {
            return ResponseEntity.ok(lang);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Язык с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
