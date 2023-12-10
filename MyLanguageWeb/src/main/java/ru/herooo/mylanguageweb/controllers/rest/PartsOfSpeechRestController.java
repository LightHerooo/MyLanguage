package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguagedb.repositories.PartOfSpeechCrudRepository;

import java.util.List;

@RestController
@RequestMapping("/api/parts_of_speech")
public class PartsOfSpeechRestController {

    private PartOfSpeechCrudRepository poscr;

    @Autowired
    public PartsOfSpeechRestController(PartOfSpeechCrudRepository poscr) {
        this.poscr = poscr;
    }

    @GetMapping()
    public List<PartOfSpeech> getAllPartsOfSpeech() {
        return poscr.findAll();
    }

    @GetMapping("/{code}")
    public PartOfSpeech getPartOfSpeechByCode(@PathVariable("code") String code) {
        return poscr.findByCode(code);
    }
}
