package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordInCollectionService;

import javax.naming.ldap.Control;

@Controller
@RequestMapping("/customer_collections")
public class CustomerCollectionsController {

    private final CustomerService CUSTOMER_SERVICE;
    private final ControllerUtils CONTROLLER_UTILS;

    public CustomerCollectionsController(CustomerService customerService,
                                         ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping()
    public String showCustomerCollectionsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.CUSTOMER_COLLECTIONS_SHOW.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/new")
    public String showNewCustomerCollectionsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.CUSTOMER_COLLECTIONS_NEW.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/new_by_key")
    public String showNewCustomerCollectionByKeyPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.CUSTOMER_COLLECTIONS_NEW_BY_KEY.PATH_TO_FILE;
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
