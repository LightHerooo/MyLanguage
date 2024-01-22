package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.PartOfSpeech;

import java.util.List;

public interface PartOfSpeechCrudRepository extends CrudRepository<PartOfSpeech, Long> {
    List<PartOfSpeech> findAllByOrderById();

    PartOfSpeech findByCode(String code);
}
