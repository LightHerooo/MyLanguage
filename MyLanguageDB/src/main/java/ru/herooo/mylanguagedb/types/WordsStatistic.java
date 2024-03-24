package ru.herooo.mylanguagedb.types;

import java.util.Optional;

public interface WordsStatistic {
    Optional<String> getWordStatusCode();
    Optional<Long> getNumberOfWords();
}
