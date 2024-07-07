package ru.herooo.mylanguageweb.controllers.usual;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WordStatus;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageweb.controllers.Redirects;
import ru.herooo.mylanguageweb.controllers.usual.utils.ControllerUtils;
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
    public String showMainPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CUSTOMER_SERVICE.changeDateOfLastVisit(request);
        request.setAttribute(ACTIVE_WORD_STATUS_ATTRIBUTE_NAME, WORD_STATUS_SERVICE.find(WordStatuses.ACTIVE));

        return "words/show";
    }

    @GetMapping("/add")
    public String showAddPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CUSTOMER_SERVICE.changeDateOfLastVisit(request);

            return "words/add";
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/my_words_history")
    public String showMyWordsHistoryPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CUSTOMER_SERVICE.changeDateOfLastVisit(request);

            WordStatus unclaimedWordsStatus = WORD_STATUS_SERVICE.find(WordStatuses.UNCLAIMED);
            request.setAttribute(UNCLAIMED_WORD_STATUS_ATTRIBUTE_NAME, unclaimedWordsStatus);

            return "/words/show_my_words_history";
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
