package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.herooo.mylanguagedb.entities.Lang;

import java.util.List;
import java.util.Optional;

public interface LangCrudRepository extends CrudRepository<Lang, Long> {
    @Query(nativeQuery = true, value =
            "SELECT * " +
            "FROM get_langs(:title, :is_active_for_in, :is_active_for_out, :number_of_items, :last_lang_id_on_previous_page)")
    List<Lang> findAll(@Param("title") String title,
                       @Param("is_active_for_in") Boolean isActiveForIn,
                       @Param("is_active_for_out") Boolean isActiveForOut,
                       @Param("number_of_items") Long numberOfItems,
                       @Param("last_lang_id_on_previous_page") Long lastLangIdOnPreviousPage);



    Optional<Lang> findByCode(String code);

    @Query(nativeQuery = true, value =
            "SELECT COUNT(*) " +
            "FROM get_langs(null, :is_active_for_in, null)")
    Optional<Long> countForIn(@Param("is_active_for_in") Boolean isActiveForIn);



    @Procedure("turn_off_langs_in")
    void turnOffLangsIn();

    @Procedure("turn_off_langs_out")
    void turnOffLangsOut();






}
