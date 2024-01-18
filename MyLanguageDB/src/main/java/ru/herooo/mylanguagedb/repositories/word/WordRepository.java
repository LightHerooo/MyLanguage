package ru.herooo.mylanguagedb.repositories.word;

import java.time.LocalDate;

public interface WordRepository<T> {

    long countByDateOfCreate(LocalDate localDate);
}
