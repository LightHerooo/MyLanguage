package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.repositories.WordStatusCrudRepository;

import java.util.List;

@Service
public class WordStatusService {
    private final WordStatusCrudRepository WORD_STATUS_CRUD_REPOSITORY;

    @Autowired
    public WordStatusService(WordStatusCrudRepository wordStatusCrudRepository) {
        this.WORD_STATUS_CRUD_REPOSITORY = wordStatusCrudRepository;
    }

    // Получение всех статусов слов
    public List<WordStatus> findAll() {
        return WORD_STATUS_CRUD_REPOSITORY.findAll();
    }

    // Поиск по коду
    public WordStatus findByCode(String code) {
        return WORD_STATUS_CRUD_REPOSITORY.findByCode(code);
    }
}
