package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;
import ru.herooo.mylanguagedb.repositories.PartOfSpeechCrudRepository;

import java.util.List;

@Service
public class PartOfSpeechService {
    private final PartOfSpeechCrudRepository PART_OF_SPEECH_CRUD_REPOSITORY;

    @Autowired
    public PartOfSpeechService(PartOfSpeechCrudRepository partOfSpeechCrudRepository) {
        this.PART_OF_SPEECH_CRUD_REPOSITORY = partOfSpeechCrudRepository;
    }

    // Получение всех частей речи
    public List<PartOfSpeech> findAll() {
        return PART_OF_SPEECH_CRUD_REPOSITORY.findAllByOrderById();
    }

    // Поиск по коду
    public PartOfSpeech findByCode(String code) {
        return PART_OF_SPEECH_CRUD_REPOSITORY.findByCode(code);
    }

}
