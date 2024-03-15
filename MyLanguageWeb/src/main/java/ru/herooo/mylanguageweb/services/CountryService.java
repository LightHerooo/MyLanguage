package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Country;
import ru.herooo.mylanguagedb.repositories.CountryCrudRepository;

import java.util.List;

@Service
public class CountryService {

    private final CountryCrudRepository COUNTRY_CRUD_REPOSITORY;

    @Autowired
    public CountryService(CountryCrudRepository countryCrudRepository) {
        this.COUNTRY_CRUD_REPOSITORY = countryCrudRepository;
    }

    public List<Country> findAll() {
        return COUNTRY_CRUD_REPOSITORY.findAll();
    }

    public Country find(String code) {
        return COUNTRY_CRUD_REPOSITORY.findByCode(code).orElse(null);
    }
}
