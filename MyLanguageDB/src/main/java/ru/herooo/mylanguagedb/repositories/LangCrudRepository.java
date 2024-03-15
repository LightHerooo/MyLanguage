package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;
import java.util.Optional;

public interface LangCrudRepository extends CrudRepository<Lang, Long> {
    Optional<Lang> findByCode(String code);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_langs_after_filter(:title)")
    List<Lang> findAllAfterFilter(@Param("title") String title);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_langs_for_in(:is_active_for_in)")
    List<Lang> findAllForIn(@Param("is_active_for_in") Boolean isActiveForIn);

    @Query(nativeQuery = true, value =
            "SELECT * FROM get_langs_for_out(:is_active_for_out)")
    List<Lang> findAllForOut(@Param("is_active_for_out") Boolean isActiveForOut);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) FROM get_langs_for_in(:is_active_for_in)")
    Optional<Long> countForIn(@Param("is_active_for_in") Boolean isActiveForIn);
}
