package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageutils.EndOfTheWord;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordService;

@Controller
public class IndexController {
    private final String NUMBER_OF_WORDS_ATTRIBUTE_NAME = "NUMBER_OF_WORDS_TEXT";
    private final String NUMBER_OF_LANGS_ATTRIBUTE_NAME = "NUMBER_OF_LANGS_TEXT";

    private final ControllerUtils CONTROLLER_UTILS;

    private final WordService WORD_SERVICE;
    private final LangService LANG_SERVICE;

    private final StringUtils STRING_UTILS;

    @Autowired
    public IndexController(ControllerUtils controllerUtils,
                           WordService wordService,
                           LangService langService,
                           StringUtils stringUtils)
    {
        this.CONTROLLER_UTILS = controllerUtils;
        this.WORD_SERVICE = wordService;
        this.LANG_SERVICE = langService;
        this.STRING_UTILS = stringUtils;
    }

    @GetMapping()
    public String showIndexPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

        // Генерируем строку количества слов (с правильным окончанием слова)
        long numberOfWords = WORD_SERVICE.count(WordStatuses.ACTIVE.CODE);
        String wordText = STRING_UTILS.
                changeEndOfTheWordByNumberOfItems("слово", numberOfWords,
                        new EndOfTheWord("", 1),
                        new EndOfTheWord("а", 1),
                        null,
                        new EndOfTheWord("", 1));
        request.setAttribute(NUMBER_OF_WORDS_ATTRIBUTE_NAME,
                String.format("%d %s", numberOfWords, wordText));

        // Генерируем строку количества языков (с правильным окончанием слова)
        long numberOfLangs = LANG_SERVICE.count();
        String numberOfLangsText = STRING_UTILS.changeEndOfTheWordByNumberOfItems(
                Long.toString(numberOfLangs), numberOfLangs,
                new EndOfTheWord("-ти", 0),
                new EndOfTheWord("-х", 0),
                new EndOfTheWord("-ом", 0),
                null);
        String langText = STRING_UTILS.
                changeEndOfTheWordByNumberOfItems("язык", numberOfLangs,
                        new EndOfTheWord("ах", 0),
                        new EndOfTheWord("ах", 0),
                        new EndOfTheWord("е", 0),
                        new EndOfTheWord("ов", 0));
        request.setAttribute(NUMBER_OF_LANGS_ATTRIBUTE_NAME,
                String.format("%s %s", numberOfLangsText, langText));

        return Views.INDEX.PATH_TO_FILE;
    }
}
