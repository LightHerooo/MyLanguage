package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;

import java.time.LocalDateTime;

@Component
public class ControllerUtils {
    private final String WEB_APP_NAME_ATTRIBUTE_NAME = "WEB_APP_NAME";
    private final String AUTH_CUSTOMER_ATTRIBUTE_NAME = "AUTH_CUSTOMER";
    private final String IS_SUPER_USER_ATTRIBUTE_NAME = "IS_SUPER_USER";
    private final String IS_ADMIN_ATTRIBUTE_NAME = "IS_ADMIN";
    private final String IS_MODERATOR_ATTRIBUTE_NAME = "IS_MODERATOR";

    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public ControllerUtils(CustomerService customerService,
                           CustomerMapping customerMapping) {
        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_MAPPING = customerMapping;
    }

    public void setGeneralAttributes(HttpServletRequest request) {
        // Название сайта
        request.setAttribute(WEB_APP_NAME_ATTRIBUTE_NAME, "MyLanguage");

        // Авторизированный пользователь
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CustomerResponseDTO responseDTO = CUSTOMER_MAPPING.mapToResponseDTO(authCustomer);
            request.setAttribute(AUTH_CUSTOMER_ATTRIBUTE_NAME, responseDTO);
        }

        // Пользователь - супер-юзер?
        request.setAttribute(IS_SUPER_USER_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isSuperUser(authCustomer));

        // Пользователь - администратор?
        request.setAttribute(IS_ADMIN_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isAdmin(authCustomer));

        // Пользователь - модератор?
        request.setAttribute(IS_MODERATOR_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isModerator(authCustomer));
    }

    public void changeDateLastVisitToAuthCustomer(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            authCustomer.setDateOfLastVisit(LocalDateTime.now());
            CUSTOMER_SERVICE.save(authCustomer);
        }
    }
}
