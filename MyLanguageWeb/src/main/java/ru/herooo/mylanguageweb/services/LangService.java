package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.lang.Langs;

import java.util.List;

@Service
public class LangService {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;

    @Autowired
    public LangService(LangCrudRepository langCrudRepository) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
    }

    // Получение всех языков
    public List<Lang> findAll() {
        return LANG_CRUD_REPOSITORY.findAll();
    }

    public List<Lang> findAllForIn(Boolean isActiveForIn) {
        return LANG_CRUD_REPOSITORY.findAllForIn(isActiveForIn);
    }

    public List<Lang> findAllForOut(Boolean isActiveForOut) {
        return LANG_CRUD_REPOSITORY.findAllForOut(isActiveForOut);
    }

    public Lang find(String code) {
        return LANG_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }

    public Lang find(Langs langs) {
        return LANG_CRUD_REPOSITORY.find(langs).orElse(null);
    }

    public long count(Boolean isActive) {
        return LANG_CRUD_REPOSITORY.countForIn(isActive).orElse(0L);
    }
}
