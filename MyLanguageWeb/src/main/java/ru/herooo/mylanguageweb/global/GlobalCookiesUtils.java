package ru.herooo.mylanguageweb.global;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

public class GlobalCookiesUtils {
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
