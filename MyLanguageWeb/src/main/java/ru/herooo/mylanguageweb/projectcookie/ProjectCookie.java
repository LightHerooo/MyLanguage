package ru.herooo.mylanguageweb.projectcookie;

public class ProjectCookie {
    public final String name;
    public final int maxAgeBySeconds;
    public final boolean isSecure;
    public final boolean isHttpOnly;
    public final String domain = "localhost:8080";

    public final String path = "/";

    public ProjectCookie(String name, int maxAgeBySeconds, boolean isSecure, boolean isHttpOnly) {
        this.name = name;
        this.maxAgeBySeconds = maxAgeBySeconds;
        this.isSecure = isSecure;
        this.isHttpOnly = isHttpOnly;
    }

    public String getName() {
        return name;
    }

    public int getMaxAgeBySeconds() {
        return maxAgeBySeconds;
    }

    public boolean isSecure() {
        return isSecure;
    }

    public boolean isHttpOnly() {
        return isHttpOnly;
    }

    public String getDomain() {
        return domain;
    }

    public String getPath() {
        return path;
    }
}
