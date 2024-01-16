package ru.herooo.mylanguageutils;

public class EndOfTheWord {
    private String value;
    private int offsetBack;

    public EndOfTheWord(String value, int offsetBack) {
        this.value = value;
        this.offsetBack = offsetBack;
    }

    public String getValue() {
        return value;
    }

    public int getOffsetBack() {
        return offsetBack;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setOffsetBack(int offsetBack) {
        this.offsetBack = offsetBack;
    }
}
