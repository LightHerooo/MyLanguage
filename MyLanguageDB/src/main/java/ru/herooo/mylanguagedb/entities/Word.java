package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name="word")
public class Word {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="title")
    private String title;

    @ManyToOne
    @JoinColumn(name="author_id")
    private Customer author;

    @ManyToOne
    @JoinColumn(name="word_status_id")
    private WordStatus wordStatus;

    @ManyToOne
    @JoinColumn(name="part_of_speech_id")
    private PartOfSpeech partOfSpeech;

    @ManyToOne
    @JoinColumn(name="lang_id")
    private Lang lang;

    public Word() {}

    public Word(String title, Customer author, WordStatus wordStatus, PartOfSpeech partOfSpeech, Lang lang) {
        this.title = title;
        this.author = author;
        this.wordStatus = wordStatus;
        this.partOfSpeech = partOfSpeech;
        this.lang = lang;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Customer getAuthor() {
        return author;
    }

    public void setAuthor(Customer author) {
        this.author = author;
    }

    public WordStatus getWordStatus() {
        return wordStatus;
    }

    public void setWordStatus(WordStatus wordStatus) {
        this.wordStatus = wordStatus;
    }

    public PartOfSpeech getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(PartOfSpeech partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }
}
