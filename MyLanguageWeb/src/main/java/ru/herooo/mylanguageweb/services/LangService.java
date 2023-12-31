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

    // Получение всех языков
    public List<Lang> findAll() {
        return LANG_CRUD_REPOSITORY.findAll();
    }

    // Поиск по коду
    public Lang findByCode(String code) {
        return LANG_CRUD_REPOSITORY.findByCode(code);
    }

    public long getNumberOfLangs() {
        return LANG_CRUD_REPOSITORY.count();
    }
}
