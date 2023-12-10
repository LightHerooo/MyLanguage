package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;

import java.util.List;

@RestController
@RequestMapping("/api/langs")
public class LangsRestController {

    private LangCrudRepository lcr;

    @Autowired
    public LangsRestController(LangCrudRepository lcr) {
        this.lcr = lcr;
    }

    @GetMapping
    public List<Lang> getAllLangs() {
        return lcr.findAll();
    }

    @GetMapping("/{code}")
    public Lang getLangByCode(@PathVariable("code") String code) {
        return lcr.findByCode(code);
    }
}
