package ru.herooo.mylanguagedb.repositories.lang;

public interface LangRepository<T> {
    T findById(Langs langs);
}
