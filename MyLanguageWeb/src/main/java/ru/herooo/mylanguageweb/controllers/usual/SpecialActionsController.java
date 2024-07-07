package ru.herooo.mylanguageweb.controllers.usual;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageweb.controllers.Redirects;
import ru.herooo.mylanguageweb.controllers.usual.utils.ControllerUtils;
import ru.herooo.mylanguageweb.services.CustomerRoleService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordStatusService;

@Controller
@RequestMapping("/special_actions")
public class SpecialActionsController {

    private final String WORD_STATUSES_ATTRIBUTE_NAME = "WORD_STATUSES";
    private final String CUSTOMER_ROLES_ATTRIBUTE_NAME = "CUSTOMER_ROLES";

    private final String ADMIN_ROLE_ATTRIBUTE_NAME = "ADMIN_ROLE";
    private final String MODERATOR_ROLE_ATTRIBUTE_NAME = "MODERATOR_ROLE";

    private final String LANG_CODE_ATTRIBUTE_NAME = "LANG_CODE";


    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;
    private final LangService LANG_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    public SpecialActionsController(CustomerService customerService,
                                    WordStatusService wordStatusService,
                                    CustomerRoleService customerRoleService,
                                    LangService langService,

                                    ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_SERVICE = wordStatusService;
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;
        this.LANG_SERVICE = langService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showMainPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);

                // Ищем роль администратора
                CustomerRole role = CUSTOMER_ROLE_SERVICE.find(CustomerRoles.ADMIN);
                request.setAttribute(ADMIN_ROLE_ATTRIBUTE_NAME, role);

                // Ищем роль модератора
                role = CUSTOMER_ROLE_SERVICE.find(CustomerRoles.MODERATOR);
                request.setAttribute(MODERATOR_ROLE_ATTRIBUTE_NAME, role);

                return "special_actions/show";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/words/show_with_current_status")
    public String showWordsWithCurrentStatusPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);
                request.setAttribute(WORD_STATUSES_ATTRIBUTE_NAME, WORD_STATUS_SERVICE.findAll());

                return "special_actions/words/show_with_current_status";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/langs/show")
    public String showLangsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);

                return "special_actions/langs/show";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/langs/show_new")
    public String showNewLangsPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);

                return "special_actions/langs/show_new";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/langs/add/{lang_code}")
    public String showAddPage(HttpServletRequest request,
                              @PathVariable("lang_code") String langCode) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);
                request.setAttribute(LANG_CODE_ATTRIBUTE_NAME, langCode);

                return "special_actions/langs/add";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/langs/edit/{lang_code}")
    public String showEditPage(HttpServletRequest request,
                              @PathVariable("lang_code") String langCode) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                Lang lang = LANG_SERVICE.findByCode(langCode);
                if (lang != null) {
                    CONTROLLER_UTILS.setGeneralAttributes(request);
                    CUSTOMER_SERVICE.changeDateOfLastVisit(request);
                    request.setAttribute(LANG_CODE_ATTRIBUTE_NAME, langCode);

                    return "special_actions/langs/edit";
                } else {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND);
                }
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/workout_types/show")
    public String showWorkoutTypesPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isSuperUser(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);

                return "special_actions/workout_types/show";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/customers/show_with_current_role")
    public String showCustomersWithCurrentRolePage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            if (CUSTOMER_SERVICE.isAdmin(authCustomer)) {
                CONTROLLER_UTILS.setGeneralAttributes(request);
                CUSTOMER_SERVICE.changeDateOfLastVisit(request);

                request.setAttribute(CUSTOMER_ROLES_ATTRIBUTE_NAME, CUSTOMER_ROLE_SERVICE.findAll());

                return "special_actions/customers/show_with_current_role";
            } else {
                return Redirects.INDEX.REDIRECT_URL;
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }
}
