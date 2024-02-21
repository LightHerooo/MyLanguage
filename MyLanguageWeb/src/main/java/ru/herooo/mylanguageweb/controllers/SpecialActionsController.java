package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Controller
@RequestMapping("/special_actions")
public class SpecialActionsController {

    private final String WORD_STATUSES_ATTRIBUTE_NAME = "WORD_STATUSES";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    public SpecialActionsController(CustomerService customerService,
                                    WordStatusService wordStatusService,
                                    ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_SERVICE = wordStatusService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showSpecialActionsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

                return Views.SPECIAL_ACTIONS_SHOW.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/change_current_status_to_words")
    public String showChangeWordsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);
                request.setAttribute(WORD_STATUSES_ATTRIBUTE_NAME, WORD_STATUS_SERVICE.findAll());

                return Views.SPECIAL_ACTIONS_CHANGE_CURRENT_STATUS_TO_WORDS.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
