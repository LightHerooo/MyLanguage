package ru.herooo.mylanguageutils;

public enum ProjectPaths {
    MAIN_FOLDER (String.format("%s/%s", System.getProperty("user.home"), ".my_language"));

    public final String PATH;

    ProjectPaths(String path) {
        this.PATH = path;
    }
}
