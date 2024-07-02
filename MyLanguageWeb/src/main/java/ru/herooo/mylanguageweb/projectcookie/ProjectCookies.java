package ru.herooo.mylanguageweb.projectcookie;

public final class ProjectCookies {
    public static final ProjectCookie CUSTOMER_AUTH_KEY =
            new ProjectCookie("customer_auth_key", 7 * 24 * 60 * 60, false, true);

    public static final ProjectCookie CUSTOMER_ID =
            new ProjectCookie("customer_id", 7 * 24 * 60 * 60, false, false);

    public static final ProjectCookie WORKOUT_AUTH_KEY =
            new ProjectCookie("workout_auth_key", 24 * 60 * 60, false, true);
}
