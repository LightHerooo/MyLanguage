package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="customer_role")
public class CustomerRole {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="title")
    private String title;

    public CustomerRole() {}

    public CustomerRole(String title) {
        this.title = title;
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
}
