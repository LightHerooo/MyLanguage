package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

import java.util.Objects;

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

    @Column(name="is_active_for_in")
    private boolean isActiveForIn;

    @Column(name="is_active_for_out")
    private boolean isActiveForOut;

    @ManyToOne
    @JoinColumn(name="country_id")
    private Country country;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Lang lang = (Lang) o;
        return id == lang.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
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

    public boolean isActiveForIn() {
        return isActiveForIn;
    }

    public void setActiveForIn(boolean activeForIn) {
        isActiveForIn = activeForIn;
    }

    public boolean isActiveForOut() {
        return isActiveForOut;
    }

    public void setActiveForOut(boolean activeForOut) {
        isActiveForOut = activeForOut;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }
}
