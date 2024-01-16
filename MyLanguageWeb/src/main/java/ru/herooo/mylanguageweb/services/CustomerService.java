package ru.herooo.mylanguageweb.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoleCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.customer.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.customer.CustomerRequestDTO;
import ru.herooo.mylanguageweb.global.GlobalCookiesUtils;
import ru.herooo.mylanguageweb.global.GlobalCookies;

import java.time.LocalDateTime;

@Service
public class CustomerService {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerService(CustomerCrudRepository customerCrudRepository,
                           CustomerRoleCrudRepository customerRoleCrudRepository,
                           CustomerMapping customerMapping,
                           StringUtils stringUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.CUSTOMER_ROLE_CRUD_REPOSITORY = customerRoleCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.STRING_UTILS = stringUtils;
    }

    // Регистрация пользователя
    public Customer register(CustomerRequestDTO customerRequestDTO) {
        // Парсим из VALID класса значения
        Customer newCustomer = CUSTOMER_MAPPING.mapToCustomer(customerRequestDTO);

        // Добавляем дополнительную информацию
        CustomerRole cr = CUSTOMER_ROLE_CRUD_REPOSITORY.findById(CustomerRoles.CUSTOMER);
        newCustomer.setRole(cr);

        newCustomer.setAuthCode(STRING_UTILS.getRandomStrEnNum(30));
        newCustomer.setDateOfCreate(LocalDateTime.now());
        newCustomer.setDateOfLastVisit(LocalDateTime.now());

        // Сохраняем
        return CUSTOMER_CRUD_REPOSITORY.save(newCustomer);
    }

    // Поиск авторизированного пользователя
    public Customer findAuth(HttpServletRequest request) {
        Cookie authCookie = GlobalCookiesUtils.getCookieInHttpRequest(request, GlobalCookies.AUTH_CODE);
        Customer customer = null;
        if (authCookie != null) {
            customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCookie.getValue());
            if (customer != null) {
                customer.setDateOfLastVisit(LocalDateTime.now());
                CUSTOMER_CRUD_REPOSITORY.save(customer);
            }
        }

        return customer;
    }

    // Вход пользователя
    public Customer entry(CustomerEntryRequestDTO dto) {
        return CUSTOMER_CRUD_REPOSITORY.findByLoginAndPassword(
                dto.getLogin(), dto.getPassword());
    }

    // Выход пользователя
    public void exit(HttpServletResponse response) {
        GlobalCookiesUtils.deleteCookieInHttpResponse(response, GlobalCookies.AUTH_CODE);
        GlobalCookiesUtils.deleteCookieInHttpResponse(response, GlobalCookies.AUTH_ID);
    }

    // Поиск по Id
    public Customer findById(long id) {
        return CUSTOMER_CRUD_REPOSITORY.findById(id);
    }

    // Поиск по логину
    public Customer findByLogin(String login) {
        return CUSTOMER_CRUD_REPOSITORY.findByLogin(login);
    }

    // Поиск по электронной почте
    public Customer findByEmail(String email) {
        return CUSTOMER_CRUD_REPOSITORY.findByEmail(email);
    }

    // Поиск по никнейму
    public Customer findByNickname(String nickname) {
        return CUSTOMER_CRUD_REPOSITORY.findByNickname(nickname);
    }

    // Поиск по ключу авторизации
    public Customer findByAuthCode(String authCode) {
        return CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCode);
    }

    public String validateAuthCode(HttpServletRequest request, String authCode) {
        try {
            if (STRING_UTILS.isStringVoid(authCode)) {
                // Проверяем авторизацию пользователя через куки
                authCode = GlobalCookiesUtils.getCookieInHttpRequest(request, GlobalCookies.AUTH_CODE).getValue();
            }
        } catch (Throwable e) { }

        return authCode;
    }

    public boolean isCustomerSuperUser(Customer customer) {
        return customer != null &&
                (customer.getRole().getId() == CustomerRoles.ADMIN.getId()
                || customer.getRole().getId() == CustomerRoles.MODERATOR.getId());
    }

    public void save(Customer customer) {
        CUSTOMER_CRUD_REPOSITORY.save(customer);
    }
}
