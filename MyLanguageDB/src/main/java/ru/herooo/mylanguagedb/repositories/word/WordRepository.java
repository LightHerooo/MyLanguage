package ru.herooo.mylanguagedb.repositories.word;

import java.time.LocalDate;

public interface WordRepository<T> {

    long count(LocalDate localDate);
}
