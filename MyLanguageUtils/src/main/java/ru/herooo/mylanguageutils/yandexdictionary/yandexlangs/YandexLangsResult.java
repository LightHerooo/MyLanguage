package ru.herooo.mylanguageutils.yandexdictionary.yandexlangs;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class YandexLangsResult {
    private String[] langs;

    public String[] getLangs() {
        return langs;
    }

    public void setLangs(String[] langs) {
        this.langs = langs;
    }

    public List<String> getLangsIn() {
        List<String> result = null;
        if (langs != null && langs.length > 0) {
            Set<String> inSupportedLangs = new HashSet<>();
            for (String lang : langs) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String leftLang = lang.substring(0, firstLineIndex);
                    inSupportedLangs.add(leftLang);
                }
            }

            result = inSupportedLangs.stream().toList();
        }

        return result;
    }

    public List<String> getLangsIn(String langOutCode) {
        List<String> result = null;
        if (langs != null && langs.length > 0) {
            result = new ArrayList<>();
            for (String lang : langs) {
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

    public List<String> getLangsOut() {
        List<String> result = null;
        if (langs != null && langs.length > 0) {
            Set<String> outSupportedLangs = new HashSet<>();
            for (String lang : langs) {
                int firstLineIndex = lang.indexOf("-");
                if (firstLineIndex != -1) {
                    String rightLang = lang.substring(firstLineIndex + 1);
                    outSupportedLangs.add(rightLang);
                }
            }

            result = outSupportedLangs.stream().toList();
        }

        return result;
    }

    public List<String> getLangsOut(String langInCode) {
        List<String> result = null;
        if (langs != null && langs.length > 0) {
            result = new ArrayList<>();
            for (String lang : langs) {
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

    public List<String> getAllLangs() {
        List<String> inSupportedLangs = getLangsIn();
        List<String> outSupportedLangs = getLangsOut();

        List<String> result = null;
        if (inSupportedLangs != null && outSupportedLangs != null) {
            Set<String> allSupportedLangs =
                    Stream.concat(inSupportedLangs.stream(), outSupportedLangs.stream()).collect(Collectors.toSet());

            result = allSupportedLangs.stream().toList();
        }

        return result;
    }

    public boolean areCoupleLangsSupported(String langInCode, String langOutCode) {
        boolean areLanguagesSupported = false;
        if (!langInCode.equals(langOutCode)) {
            if (langs != null && langs.length > 0) {
                String couple = String.format("%s-%s", langInCode, langOutCode);
                areLanguagesSupported = Arrays.asList(langs).contains(couple);
            }
        }

        return areLanguagesSupported;
    }
}
