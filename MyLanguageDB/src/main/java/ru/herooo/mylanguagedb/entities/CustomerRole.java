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

    @Column(name="path_to_image")
    private String pathToImage;

    @Column(name="code")
    private String code;

    @Column(name="message")
    private String message;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    public CustomerRole() {}

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPathToImage() {
        return pathToImage;
    }

    public void setPathToImage(String pathToImage) {
        this.pathToImage = pathToImage;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        CustomerRole customerRole = (CustomerRole) obj;

        return this.id == customerRole.getId();
    }
}
