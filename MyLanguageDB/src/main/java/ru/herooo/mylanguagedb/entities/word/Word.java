package ru.herooo.mylanguagedb.entities.word;

import jakarta.persistence.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;

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
    @JoinColumn(name="customer_id")
    private Customer customer;

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

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer author) {
        this.customer = author;
    }

    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }
}
