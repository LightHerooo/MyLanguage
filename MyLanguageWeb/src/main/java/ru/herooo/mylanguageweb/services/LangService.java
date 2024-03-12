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
    public List<Lang> findAll(String title) {
        return LANG_CRUD_REPOSITORY.findAllAfterFilter(title);
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

    public Lang changeActivityForIn(Lang lang, boolean isActiveForIn) {
        Lang result = null;
        if (lang != null) {
            lang.setActiveForIn(isActiveForIn);
            result = LANG_CRUD_REPOSITORY.save(lang);
        }

        return result;
    }

    public Lang changeActivityForOut(Lang lang, boolean isActiveForOut) {
        Lang result = null;
        if (lang != null) {
            lang.setActiveForOut(isActiveForOut);
            result = LANG_CRUD_REPOSITORY.save(lang);
        }

        return result;
    }
}
