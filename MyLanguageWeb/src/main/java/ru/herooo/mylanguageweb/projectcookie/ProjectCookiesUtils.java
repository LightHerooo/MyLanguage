package ru.herooo.mylanguageweb.projectcookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

public class ProjectCookiesUtils {
    public void add(HttpServletResponse response, ProjectCookie projectCookie, String value, int maxAgeBySeconds) {
        Cookie cookie = new Cookie(projectCookie.getName(), value);
        cookie.setMaxAge(maxAgeBySeconds);
        cookie.setSecure(projectCookie.isSecure());
        cookie.setHttpOnly(projectCookie.isHttpOnly());
        cookie.setPath(projectCookie.getPath());

        response.addCookie(cookie);
    }

    public void add(HttpServletResponse response, ProjectCookie projectCookie, String value) {
        this.add(response, projectCookie, value, projectCookie.getMaxAgeBySeconds());
    }

    public void delete(HttpServletResponse response, ProjectCookie projectCookie) {
        this.add(response, projectCookie, null, 0);
    }

    public Cookie get(HttpServletRequest request, ProjectCookie projectCookie) {
        Cookie cookie = null;
        if (request != null && request.getCookies() != null) {
            cookie = Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals(projectCookie.getName()))
                    .findAny()
                    .orElse(null);
        }

        return cookie;
    }
}
