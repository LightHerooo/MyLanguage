package ru.herooo.mylanguagedb.repositories.lang;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;
import java.util.Optional;

public interface LangCrudRepository extends CrudRepository<Lang, Long>, LangRepository<Lang> {
    Optional<Lang> findByCode(String code);

    @Query(value =
            "FROM Lang l " +
            "ORDER BY l.title")
    List<Lang> findAll();

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_langs(:is_active)")
    List<Lang> findAll(@Param("is_active") Boolean isActive);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) FROM get_langs(:is_active)")
    Optional<Long> count(@Param("is_active") Boolean isActive);
}
