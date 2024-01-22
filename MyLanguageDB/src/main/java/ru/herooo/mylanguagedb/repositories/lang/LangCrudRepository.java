package ru.herooo.mylanguagedb.repositories.lang;

import org.springframework.data.repository.CrudRepository;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;

public interface LangCrudRepository extends CrudRepository<Lang, Long>, LangRepository<Lang> {
    List<Lang> findAllByOrderById();
    Lang findByCode(String code);
}
