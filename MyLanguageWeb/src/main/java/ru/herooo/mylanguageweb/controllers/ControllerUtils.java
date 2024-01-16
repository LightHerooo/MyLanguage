package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageweb.services.CustomerService;

import java.time.LocalDateTime;

@Component
public class ControllerUtils {
    private final String WEB_APP_NAME_ATTRIBUTE_NAME = "WEB_APP_NAME";
    private final String AUTH_CUSTOMER_ATTRIBUTE_NAME = "AUTH_CUSTOMER";
    private final String IS_USER_SUPER_ATTRIBUTE_NAME = "IS_USER_SUPER";

    private final CustomerService CUSTOMER_SERVICE;

    @Autowired
    public ControllerUtils(CustomerService customerService) {
        this.CUSTOMER_SERVICE = customerService;
    }

    public void setGeneralAttributes(HttpServletRequest request) {
        // Название сайта
        request.setAttribute(WEB_APP_NAME_ATTRIBUTE_NAME, "MyLanguage");

        // Авторизированный пользователь
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        request.setAttribute(AUTH_CUSTOMER_ATTRIBUTE_NAME, authCustomer);

        // Пользователь - супер-юзер?
        request.setAttribute(IS_USER_SUPER_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isCustomerSuperUser(authCustomer));
    }

    public void changeDateLastVisitToAuthCustomer(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer != null) {
            authCustomer.setDateOfLastVisit(LocalDateTime.now());
            CUSTOMER_SERVICE.save(authCustomer);
        }
    }
}
