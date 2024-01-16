package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="word")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "word_id_seq")
    @SequenceGenerator(name = "word_id_seq", sequenceName = "word_id_seq", allocationSize = 1)
    private long id;

    @Column(name="title")
    private String title;

    @Column(name="date_of_create")
    private LocalDateTime dateOfCreate;

    @ManyToOne
    @JoinColumn(name="author_id")
    private Customer author;

    @ManyToOne
    @JoinColumn(name="part_of_speech_id")
    private PartOfSpeech partOfSpeech;

    @ManyToOne
    @JoinColumn(name="lang_id")
    private Lang lang;

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

    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }

    public PartOfSpeech getPartOfSpeech() {
        return partOfSpeech;
    }

    public void setPartOfSpeech(PartOfSpeech partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }
}
