package ru.herooo.mylanguageweb.dto;

public class CustomResponseMessage {
    private int id;
    private String text;

    private boolean lol;

    public CustomResponseMessage() {}
    public CustomResponseMessage(int id, String text) {
        this.id = id;
        this.text = text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
