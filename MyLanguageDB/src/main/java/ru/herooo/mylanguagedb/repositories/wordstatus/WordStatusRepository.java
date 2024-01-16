package ru.herooo.mylanguagedb.repositories.wordstatus;

public interface WordStatusRepository<T> {
    T findById(WordStatuses wordStatuses);
}
