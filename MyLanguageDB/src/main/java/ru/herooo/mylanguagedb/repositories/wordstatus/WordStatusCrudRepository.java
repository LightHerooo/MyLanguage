package ru.herooo.mylanguagedb.repositories.wordstatus;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WordStatus;

import java.util.List;

@Repository
public interface WordStatusCrudRepository extends CrudRepository<WordStatus, Long>, WordStatusRepository<WordStatus> {
    List<WordStatus> findAll();

    WordStatus findByCode(String code);
}
