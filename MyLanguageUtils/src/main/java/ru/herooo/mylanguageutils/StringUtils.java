package ru.herooo.mylanguageutils;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class StringUtils {

    public String createRandomStrEn(int length) {
        Random random = new Random();
        String rndStrBuffer = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvwxyz";
        StringBuilder strBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            strBuilder.append(rndStrBuffer.charAt(random.nextInt(rndStrBuffer.length())));
        }

        return strBuilder.toString();
    }

    public String createWordWithNewEnding(String word,
                                          long numberOfItems,
                                          String endingBetweenFiveAndTwenty,
                                          String endingBetweenTwoAndFour,
                                          String endingSingle,
                                          String endingZero,
                                          int oldEndingLength) {
        String wordWithNewEnding = word;

        if (!isStringVoid(word)) {
            long remainsOfOneHundred = numberOfItems % 100;
            long remainsOfTen = numberOfItems % 10;

            String neededEnding = null;
            if ((remainsOfOneHundred >= 10
                    && remainsOfOneHundred <= 20)
                    || remainsOfTen >= 5) {
                neededEnding = endingBetweenFiveAndTwenty;
            } else if (remainsOfTen >= 2) {
                neededEnding = endingBetweenTwoAndFour;
            } else if (remainsOfTen == 1) {
                neededEnding = endingSingle;
            } else if (remainsOfTen == 0) {
                neededEnding = endingZero;
            }

            if (oldEndingLength >= 0
                    && oldEndingLength < word.length()) {
                wordWithNewEnding = word.substring(0, word.length() - oldEndingLength);

                if (!isStringVoid(neededEnding)) {
                    wordWithNewEnding = String.format("%s%s", wordWithNewEnding, neededEnding);
                }
            }
        }

        return wordWithNewEnding;
    }

    public String createDateWithTimeStr(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy (HH:mm)");
        return dateTime.format(formatter);
    }

    public String createStrTrimToLower(String str) {
        String result = null;

        if (!isStringVoid(str)) {
            result = str.trim();
            result = result.toLowerCase();
        }

        return result;
    }

    public String createStrTrimFirstUpper(String str) {
        String result = null;

        if (!isStringVoid(str)) {
            result = str.trim();

            String firstSymbol = String.valueOf(result.charAt(0)).toUpperCase();
            String otherStr = "";
            if (result.length() > 1) {
                otherStr = result.substring(1).toLowerCase();
            }

            result = String.format("%s%s", firstSymbol, otherStr);
        }

        return result;
    }

    public boolean isStringVoid(String value) {
        return value == null || value.isEmpty() || value.isBlank();
    }
}
