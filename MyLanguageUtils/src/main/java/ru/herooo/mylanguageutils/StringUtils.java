package ru.herooo.mylanguageutils;

import java.util.Random;

public class StringUtils {

    private final Random random = new Random();

    public String getRandomStrEnNum(int length) {
        StringBuilder strBuilder = new StringBuilder(length);
        int anLen = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".length();
        synchronized(random) {
            for(int i = 0; i < length; ++i) {
                strBuilder.append("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(random.nextInt(anLen)));
            }

            return strBuilder.toString();
        }
    }
}
