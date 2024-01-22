package ru.herooo.mylanguagedb.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "workout_type")
public class WorkoutType {

    @Id
    @GeneratedValue
    long id;

    @Column(name = "title")
    private String title;

    @Column(name = "code")
    private String code;

    @Column(name = "message")
    private String message;

    @Column(name = "path_to_image")
    private String pathToImage;

    @Column(name = "is_active")
    private Boolean isActive;

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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPathToImage() {
        return pathToImage;
    }

    public void setPathToImage(String pathToImage) {
        this.pathToImage = pathToImage;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}
