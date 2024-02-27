package ru.herooo.mylanguagedb.repositories.wordstatus;

import java.util.Optional;

public interface WordStatusRepository<T> {
    Optional<T> find(WordStatuses wordStatuses);
}
