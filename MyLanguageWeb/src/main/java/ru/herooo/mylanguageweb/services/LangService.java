package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;

import java.util.List;

@Service
public class LangService {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;

    @Autowired
    public LangService(LangCrudRepository langCrudRepository) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
    }

    public List<Lang> findAll(String title, Boolean isActiveForIn, Boolean isActiveForOut, Long numberOfItems,
                              Long lastLangIdOnPreviousPage) {
        return LANG_CRUD_REPOSITORY.findAll(title, isActiveForIn, isActiveForOut, numberOfItems, lastLangIdOnPreviousPage);
    }

    public List<Lang> findAll() {
        return LANG_CRUD_REPOSITORY.findAll(null, null, null, 0L, 0L);
    }

    public List<Lang> findAllForIn(Boolean isActiveForIn) {
        return LANG_CRUD_REPOSITORY.findAll(null, isActiveForIn, null, 0L, 0L);
    }

    public List<Lang> findAllForOut(Boolean isActiveForOut) {
        return LANG_CRUD_REPOSITORY.findAll(null, null, isActiveForOut, 0L, 0L);
    }



    public Lang find(String code) {
        return LANG_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }

    public Lang editIsActiveForIn(Lang lang, boolean isActiveForIn) {
        Lang result = null;
        if (lang != null) {
            lang.setActiveForIn(isActiveForIn);
            result = LANG_CRUD_REPOSITORY.save(lang);
        }

        return result;
    }

    public Lang editIsActiveForOut(Lang lang, boolean isActiveForOut) {
        Lang result = null;
        if (lang != null) {
            lang.setActiveForOut(isActiveForOut);
            result = LANG_CRUD_REPOSITORY.save(lang);
        }

        return result;
    }



    public long countForIn(Boolean isActiveForIn) {
        return LANG_CRUD_REPOSITORY.countForIn(isActiveForIn).orElse(0L);
    }



    public void turnOffLangsIn() {
        LANG_CRUD_REPOSITORY.turnOffLangsIn();
    }

    public void turnOffLangsOut() {
        LANG_CRUD_REPOSITORY.turnOffLangsOut();
    }
}
