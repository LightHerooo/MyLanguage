package ru.herooo.mylanguageutils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class StringUtils {

    public String getRandomStrEn(int length) {
        Random random = new Random();
        String rndStrBuffer = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvwxyz";
        StringBuilder strBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            strBuilder.append(rndStrBuffer.charAt(random.nextInt(rndStrBuffer.length())));
        }

        return strBuilder.toString();
    }

    public String changeEndOfTheWordByNumberOfItems(String word,
                                                    long numberOfItems,
                                                    EndOfTheWord endIfBetweenFiveAndTwenty,
                                                    EndOfTheWord endIfBetweenTwoAndFour,
                                                    EndOfTheWord endIfSingle,
                                                    EndOfTheWord endIfZero) {
        numberOfItems = Math.abs(numberOfItems);
        long remainsOfOneHundred = numberOfItems % 100;
        long remainsOfTen = numberOfItems % 10;
        if (remainsOfOneHundred >= 10 && remainsOfOneHundred <= 20
                || remainsOfTen >= 5) {
            if (endIfBetweenFiveAndTwenty != null) {
                word = word.substring(0, word.length() - endIfBetweenFiveAndTwenty.getOffsetBack());
                return word + endIfBetweenFiveAndTwenty.getValue();
            } else {
                return word;
            }
        }

        if (remainsOfTen >= 2) {
            if (endIfBetweenTwoAndFour != null) {
                word = word.substring(0, word.length() - endIfBetweenTwoAndFour.getOffsetBack());
                return word + endIfBetweenTwoAndFour.getValue();
            } else {
                return word;
            }
        } else if (remainsOfTen == 1) {
            if (endIfSingle != null) {
                word = word.substring(0, word.length() - endIfSingle.getOffsetBack());
                return word + endIfSingle.getValue();
            } else {
                return word;
            }
        } else if (remainsOfTen == 0) {
            if (endIfZero != null) {
                word = word.substring(0, word.length() - endIfZero.getOffsetBack());
                return word + endIfZero.getValue();
            } else {
                return word;
            }
        }

        return word;
    }

    public boolean isNotStringVoid(String value) {
        return value != null && !value.isEmpty() && !value.isBlank();
    }

    public boolean isStringVoid(String value) {
        return value == null || value.isEmpty() || value.isBlank();
    }

    public String getDateFormat(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        return dateTime.format(formatter);
    }

    public String getClearString(String str) {
        if (str != null) {
            str = str.trim();
            str = str.toLowerCase();

            return str;
        }

        return null;
    }
}
