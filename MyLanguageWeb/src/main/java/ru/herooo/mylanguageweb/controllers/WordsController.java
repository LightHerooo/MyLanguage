package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Controller
@RequestMapping("/words")
public class WordsController {

    private final String UNCLAIMED_WORD_STATUS_ATTRIBUTE_NAME = "UNCLAIMED_WORD_STATUS";
    private final String ACTIVE_WORD_STATUS_ATTRIBUTE_NAME = "ACTIVE_WORD_STATUS";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    public WordsController(CustomerService customerService,
                           WordStatusService wordStatusService,
                           ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_SERVICE = wordStatusService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showWordsPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
        request.setAttribute(ACTIVE_WORD_STATUS_ATTRIBUTE_NAME, WORD_STATUS_SERVICE.find(WordStatuses.ACTIVE));
        return Views.WORDS_SHOW.PATH_TO_FILE;
    }

    @GetMapping("/new")
    public String showNewWordsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
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
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            WordStatus unclaimedWordsStatus = WORD_STATUS_SERVICE.find(WordStatuses.UNCLAIMED);
            request.setAttribute(UNCLAIMED_WORD_STATUS_ATTRIBUTE_NAME, unclaimedWordsStatus);

            return Views.WORDS_MY_WORDS_HISTORY.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
