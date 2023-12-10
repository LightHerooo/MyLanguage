package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "word_status")
public class WordStatus {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "code")
    private String code;

    public WordStatus() {}

    public WordStatus(String title, String code) {
        this.title = title;
        this.code = code;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
