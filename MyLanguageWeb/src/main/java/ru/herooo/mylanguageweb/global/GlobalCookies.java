package ru.herooo.mylanguageweb.global;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

public enum GlobalCookies {

    AUTH_CODE ("auth_code", 7 * 24 * 60 * 60, false, true),
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


    private static void addCookieInHttpResponse(HttpServletResponse response, GlobalCookies globalCookies, String value,
                                                int maxAgeInSecond) {
        Cookie cookie = new Cookie(globalCookies.NAME, value);
        cookie.setMaxAge(maxAgeInSecond);
        cookie.setSecure(globalCookies.IS_SECURE);
        cookie.setHttpOnly(globalCookies.IS_HTTP_ONLY);
        cookie.setPath(globalCookies.PATH);
        response.addCookie(cookie);
    }

    public static void addCookieInHttpResponse(HttpServletResponse response, GlobalCookies globalCookies, String value) {
        addCookieInHttpResponse(response, globalCookies, value, globalCookies.MAX_AGE_IN_SECONDS);
    }

    public static void deleteCookieInHttpResponse(HttpServletResponse response, GlobalCookies globalCookies) {
        addCookieInHttpResponse(response, globalCookies, null, 0);
    }

    public static Cookie getCookieInHttpRequest(HttpServletRequest request, GlobalCookies globalCookies) {
        Cookie cookie = null;
        if (request != null && request.getCookies() != null) {
            cookie = Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals(globalCookies.NAME))
                    .findAny()
                    .orElse(null);
        }

        return cookie;
    }
}