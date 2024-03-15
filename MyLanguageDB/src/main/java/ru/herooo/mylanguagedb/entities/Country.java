package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name="country")
public class Country {
    @Id
    @GeneratedValue
    private long id;

    @Column(name="title")
    private String title;

    @Column(name="code")
    private String code;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
