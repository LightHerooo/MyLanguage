package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageweb.controllers.classes.WordStatusWithNumberOfWords;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordService;
import ru.herooo.mylanguageweb.services.WordStatusService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/words")
public class WordsController {

    private final String DATE_NOW_ATTRIBUTE_NAME = "DATE_NOW";
    private final String NUMBER_OF_WORDS_TODAY_ATTRIBUTE_NAME = "NUMBER_OF_WORDS_TODAY";
    private final String UNCLAIMED_WORD_STATUS_ATTRIBUTE_NAME = "UNCLAIMED_WORD_STATUS";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordService WORD_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;

    private final StringUtils STRING_UTILS;
    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    public WordsController(CustomerService customerService,
                           WordService wordService,
                           WordStatusService wordStatusService,
                           StringUtils stringUtils,
                           ControllerUtils controllerUtils)
    {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.WORD_STATUS_SERVICE = wordStatusService;

        this.STRING_UTILS = stringUtils;
        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showWordsPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
        request.setAttribute(DATE_NOW_ATTRIBUTE_NAME, STRING_UTILS.getDateFormat(LocalDateTime.now()));
        request.setAttribute(NUMBER_OF_WORDS_TODAY_ATTRIBUTE_NAME,
                WORD_SERVICE.getNumberOfWordsByDateOfCreate(LocalDateTime.now()));

        return Views.WORDS_SHOW.PATH_TO_FILE;
    }

    @GetMapping("/new")
    public String showNewWordsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.WORDS_NEW.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/my_words_history")
    public String showNewWordsHistoryPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            WordStatus unclaimedWordsStatus = WORD_STATUS_SERVICE.findById(WordStatuses.UNCLAIMED);
            request.setAttribute(UNCLAIMED_WORD_STATUS_ATTRIBUTE_NAME, unclaimedWordsStatus);

            return Views.WORDS_MY_WORDS_HISTORY.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
