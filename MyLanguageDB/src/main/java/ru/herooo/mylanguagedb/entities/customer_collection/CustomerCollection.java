package ru.herooo.mylanguagedb.entities.customer_collection;

import jakarta.persistence.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name="customer_collection")
public class CustomerCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_collection_id_seq")
    @SequenceGenerator(name = "customer_collection_id_seq", sequenceName = "customer_collection_id_seq", allocationSize = 1)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name="date_of_create")
    private LocalDateTime dateOfCreate;

    @Column(name="is_active_for_author")
    private boolean isActiveForAuthor;

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name="lang_id")
    private Lang lang;

    public CustomerCollection() {}

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getDateOfCreate() {
        return dateOfCreate;
    }

    public void setDateOfCreate(LocalDateTime dateOfCreate) {
        this.dateOfCreate = dateOfCreate;
    }

    public boolean isActiveForAuthor() {
        return isActiveForAuthor;
    }

    public void setActiveForAuthor(boolean activeForAuthor) {
        isActiveForAuthor = activeForAuthor;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Lang getLang() {
        return lang;
    }

    public void setLang(Lang lang) {
        this.lang = lang;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomerCollection that = (CustomerCollection) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
