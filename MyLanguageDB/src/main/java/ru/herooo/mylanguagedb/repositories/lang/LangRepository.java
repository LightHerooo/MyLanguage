package ru.herooo.mylanguagedb.repositories.lang;

import java.util.Optional;

public interface LangRepository<T> {
    Optional<T> find(Langs langs);
}
