package ru.herooo.mylanguagedb.repositories.lang;

public interface LangRepository<T> {
    T find(Langs langs);
}
