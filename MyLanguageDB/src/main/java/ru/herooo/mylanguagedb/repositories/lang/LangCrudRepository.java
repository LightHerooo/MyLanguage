package ru.herooo.mylanguagedb.repositories.lang;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;

public interface LangCrudRepository extends CrudRepository<Lang, Long>, LangRepository<Lang> {
    Lang findByCode(String code);

    @Query(value =
            "FROM Lang l " +
            "ORDER BY l.title")
    List<Lang> findAll();

    @Query(value =
            "FROM Lang l " +
            "WHERE l.isActive = :is_active " +
            "ORDER BY l.title")
    List<Lang> findAll(@Param("is_active") Boolean isActive);
}
