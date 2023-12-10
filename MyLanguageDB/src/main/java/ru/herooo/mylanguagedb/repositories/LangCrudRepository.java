package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;

public interface LangCrudRepository extends CrudRepository<Lang, Long> {
    List<Lang> findAll();

    Lang findByCode(String code);
}
