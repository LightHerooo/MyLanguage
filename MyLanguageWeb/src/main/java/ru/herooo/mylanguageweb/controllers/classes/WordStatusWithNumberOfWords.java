package ru.herooo.mylanguageweb.controllers.classes;

import ru.herooo.mylanguagedb.entities.WordStatus;

public class WordStatusWithNumberOfWords {
    private WordStatus wordStatus;
    private long numberOfWords;

    public WordStatusWithNumberOfWords(WordStatus wordStatus, long numberOfWords) {
        this.wordStatus = wordStatus;
        this.numberOfWords = numberOfWords;
    }

    public WordStatus getWordStatus() {
        return wordStatus;
    }

    public void setWordStatus(WordStatus wordStatus) {
        this.wordStatus = wordStatus;
    }

    public long getNumberOfWords() {
        return numberOfWords;
    }

    public void setNumberOfWords(long numberOfWords) {
        this.numberOfWords = numberOfWords;
    }
}
