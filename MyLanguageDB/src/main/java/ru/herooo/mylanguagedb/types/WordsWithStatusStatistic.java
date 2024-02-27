package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface WordsWithStatusStatistic {
    Optional<String> getWordStatusCode();
    Optional<Long> getNumberOfWords();
}
