package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.services.CustomerRoleService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Controller
@RequestMapping("/special_actions")
public class SpecialActionsController {

    private final String WORD_STATUSES_ATTRIBUTE_NAME = "WORD_STATUSES";
    private final String CUSTOMER_ROLES_ATTRIBUTE_NAME = "CUSTOMER_ROLES";

    private final String ADMIN_ROLE_ATTRIBUTE_NAME = "ADMIN_ROLE";
    private final String MODERATOR_ROLE_ATTRIBUTE_NAME = "MODERATOR_ROLE";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    public SpecialActionsController(CustomerService customerService,
                                    WordStatusService wordStatusService,
                                    CustomerRoleService customerRoleService,

                                    ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_SERVICE = wordStatusService;
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showSpecialActionsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

                // Ищем роль администратора
                CustomerRole role = CUSTOMER_ROLE_SERVICE.find(CustomerRoles.ADMIN);
                request.setAttribute(ADMIN_ROLE_ATTRIBUTE_NAME, role);

                // Ищем роль модератора
                role = CUSTOMER_ROLE_SERVICE.find(CustomerRoles.MODERATOR);
                request.setAttribute(MODERATOR_ROLE_ATTRIBUTE_NAME, role);

                return Views.SPECIAL_ACTIONS_SHOW.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/change_current_status_to_words")
    public String showChangeCurrentStatusToWordsPage(HttpServletRequest request) {
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

    @GetMapping("/change_active_statuses_to_langs")
    public String showChangeActiveStatusesToLangsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

                return Views.SPECIAL_ACTIONS_CHANGE_ACTIVE_STATUSES_TO_LANGS.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/change_active_status_to_workout_types")
    public String showChangeActiveStatusToWorkoutTypesPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

                return Views.SPECIAL_ACTIONS_CHANGE_ACTIVE_STATUS_TO_WORKOUT_TYPES.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/change_role_to_customers")
    public String showChangeRoleToCustomersPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isAdmin(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

                request.setAttribute(CUSTOMER_ROLES_ATTRIBUTE_NAME, CUSTOMER_ROLE_SERVICE.findAll());

                return Views.SPECIAL_ACTIONS_CHANGE_ROLE_TO_CUSTOMERS.PATH_TO_FILE;
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
