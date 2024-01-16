package ru.herooo.mylanguageweb.global;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

public enum GlobalCookies {

    AUTH_CODE ("auth_code", 7 * 24 * 60 * 60, false, true),
    AUTH_ID("auth_id", 7 * 24 * 60 * 60, false, false)
    ;

    public final String NAME;
    public final int MAX_AGE_IN_SECONDS;
    public final boolean IS_SECURE;
    public final boolean IS_HTTP_ONLY;
    public final String DOMAIN = "localhost:8080";
    public final String PATH = "/";

    GlobalCookies(String name, int maxAgeInSeconds, boolean isSecure, boolean isHttpOnly) {
        this.NAME = name;
        this.MAX_AGE_IN_SECONDS = maxAgeInSeconds;
        this.IS_SECURE = isSecure;
        this.IS_HTTP_ONLY = isHttpOnly;
    }
}