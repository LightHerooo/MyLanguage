package ru.herooo.mylanguageutils.yandexdictionary.yandexlangs;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class YandexLangs {
    private String[] langCodeCouples;

    public String[] getLangCodeCouples() {
        return langCodeCouples;
    }

    public void setLangCodeCouples(String[] langCodeCouples) {
        this.langCodeCouples = langCodeCouples;
    }


    public List<String> getLangInCodes() {
        List<String> result = null;
        if (langCodeCouples != null && langCodeCouples.length > 0) {
            Set<String> langInCodes = new HashSet<>();
            for (String lang : langCodeCouples) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String leftLang = lang.substring(0, firstLineIndex);
                    langInCodes.add(leftLang);
                }
            }

            result = langInCodes.stream().toList();
        }

        return result;
    }

    public List<String> getLangInCodes(String langOutCode) {
        List<String> result = null;
        if (langCodeCouples != null && langCodeCouples.length > 0) {
            result = new ArrayList<>();
            for (String lang : langCodeCouples) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String rightLang = lang.substring(firstLineIndex + 1);
                    if (rightLang.equals(langOutCode)) {
                        String leftLang = lang.substring(0, firstLineIndex);
                        result.add(leftLang);
                    }
                }
            }
        }

        return result;
    }

    public List<String> getLangOutCodes() {
        List<String> result = null;
        if (langCodeCouples != null && langCodeCouples.length > 0) {
            Set<String> langOutCodes = new HashSet<>();
            for (String lang : langCodeCouples) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String rightLang = lang.substring(firstLineIndex + 1);
                    langOutCodes.add(rightLang);
                }
            }

            result = langOutCodes.stream().toList();
        }

        return result;
    }

    public List<String> getLangOutCodes(String langInCode) {
        List<String> result = null;
        if (langCodeCouples != null && langCodeCouples.length > 0) {
            result = new ArrayList<>();
            for (String lang : langCodeCouples) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String leftLang = lang.substring(0, firstLineIndex);
                    if (leftLang.equals(langInCode)) {
                        String rightLang = lang.substring(firstLineIndex + 1);
                        result.add(rightLang);
                    }
                }
            }
        }

        return result;
    }

    public List<String> getLangCodes() {
        List<String> langInCodes = getLangInCodes();
        List<String> langOutCodes = getLangOutCodes();

        List<String> result = null;
        if (langInCodes != null && langOutCodes != null) {
            Set<String> allSupportedLangs =
                    Stream.concat(langInCodes.stream(), langOutCodes.stream()).collect(Collectors.toSet());

            result = allSupportedLangs.stream().toList();
        }

        return result;
    }

    public boolean isCoupleSupport(String langInCode, String langOutCode) {
        boolean areLanguagesSupported = false;
        if (!langInCode.equals(langOutCode)) {
            if (langCodeCouples != null && langCodeCouples.length > 0) {
                String couple = String.format("%s-%s", langInCode, langOutCode);
                areLanguagesSupported = Arrays.asList(langCodeCouples).contains(couple);
            }
        }

        return areLanguagesSupported;
    }
}
