package ru.herooo.mylanguagedb.repositories.word;

import java.time.LocalDate;
import java.util.Optional;

public interface WordRepository<T> {

    Optional<Long> countByDateOfCreate(LocalDate localDate);
}
