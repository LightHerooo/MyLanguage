package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.WordStatus;

import java.util.List;

public interface WordStatusCrudRepository extends CrudRepository<WordStatus, Long> {
    List<WordStatus> findAll();
    WordStatus findByCode(String code);

}
