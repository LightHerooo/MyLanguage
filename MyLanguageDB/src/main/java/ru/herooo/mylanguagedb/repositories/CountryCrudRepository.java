package ru.herooo.mylanguagedb.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.herooo.mylanguagedb.entities.Country;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryCrudRepository extends CrudRepository<Country, Long> {

    @Query(value =
            "FROM Country c " +
            "ORDER BY c.title ASC")
    List<Country> findAll();
    Optional<Country> findByCode(String code);
}
