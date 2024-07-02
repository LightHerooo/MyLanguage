package ru.herooo.mylanguagedb.entities.word.types;

import java.util.Optional;

public interface WordsStatistic {
    Optional<String> getWordStatusCode();
    Optional<Long> getNumberOfWords();
}
