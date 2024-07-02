package ru.herooo.mylanguageweb.controllers.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.Views;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordService;

@Controller
public class IndexController {
    private final String NUMBER_OF_WORDS_ATTRIBUTE_NAME = "NUMBER_OF_WORDS_TEXT";
    private final String NUMBER_OF_LANGS_ATTRIBUTE_NAME = "NUMBER_OF_LANGS_TEXT";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordService WORD_SERVICE;
    private final LangService LANG_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;
    private final StringUtils STRING_UTILS;

    @Autowired
    public IndexController(CustomerService customerService,
                           WordService wordService,
                           LangService langService,

                           ControllerUtils controllerUtils,
                           StringUtils stringUtils)
    {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.LANG_SERVICE = langService;

        this.CONTROLLER_UTILS = controllerUtils;
        this.STRING_UTILS = stringUtils;
    }

    @GetMapping()
    public String showIndexPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CUSTOMER_SERVICE.changeDateOfLastVisit(request);

        // Генерируем строку количества слов (с правильным окончанием слова)
        long numberOfWords = WORD_SERVICE.countByWordStatusCode(WordStatuses.ACTIVE.CODE);
        String wordText = STRING_UTILS.createWordWithNewEnding("слово",
                numberOfWords,
                null,
                "а",
                null,
                null,
                1);
        request.setAttribute(NUMBER_OF_WORDS_ATTRIBUTE_NAME,
                String.format("%d %s", numberOfWords, wordText));

        // Генерируем строку количества языков (с правильным окончанием слова)
        long numberOfLangs = LANG_SERVICE.countForIn(true);
        String langText = STRING_UTILS.createWordWithNewEnding("язык",
                numberOfLangs,
                "ах",
                "ах",
                "е",
                "ах",
                0);
        request.setAttribute(NUMBER_OF_LANGS_ATTRIBUTE_NAME,
                String.format("%d %s", numberOfLangs, langText));

        return Views.INDEX.PATH_TO_FILE;
    }
}
