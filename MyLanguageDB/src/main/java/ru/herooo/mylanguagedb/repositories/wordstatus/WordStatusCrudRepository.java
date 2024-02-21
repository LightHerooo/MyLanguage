package ru.herooo.mylanguagedb.repositories.wordstatus;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.WordStatus;

import java.util.List;

@Repository
public interface WordStatusCrudRepository extends CrudRepository<WordStatus, Long>, WordStatusRepository<WordStatus> {

    WordStatus findByCode(String code);

    @Query(value =
            "FROM WordStatus ws " +
            "ORDER BY ws.title")
    List<WordStatus> findAll();
}
