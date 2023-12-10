package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name="lang")
public class Lang {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="title")
    private String title;

    @Column(name="code")
    private String code;

    public Lang() {}

    public Lang(String title, String code) {
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
