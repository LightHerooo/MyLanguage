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
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.customer.CustomerRegValidDTO;
import ru.herooo.mylanguageweb.global.GlobalCookies;

@Service
public class CustomerService {

    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY;
    private final CustomerMapping CUSTOMER_MAPPING;
    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerService(CustomerCrudRepository customerCrudRepository, CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY,
                           CustomerMapping CUSTOMER_MAPPING, StringUtils stringUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.CUSTOMER_ROLE_CRUD_REPOSITORY = CUSTOMER_ROLE_CRUD_REPOSITORY;
        this.CUSTOMER_MAPPING = CUSTOMER_MAPPING;
        this.STRING_UTILS = stringUtils;
    }

    // Регистрация пользователя
    public Customer register(CustomerRegValidDTO customerRegValidDTO) {
        Customer newCustomer = null;
        try {
            // Парсим из VALID класса значения
            newCustomer = CUSTOMER_MAPPING.mapToCustomer(customerRegValidDTO);

            // Добавляем дополнительную информацию
            CustomerRole cr = CUSTOMER_ROLE_CRUD_REPOSITORY.findById(CustomerRoles.CUSTOMER);
            newCustomer.setRole(cr);
            newCustomer.setAuthCode(STRING_UTILS.getRandomStrEnNum(30));

            // Сохраняем
            CUSTOMER_CRUD_REPOSITORY.save(newCustomer);
        } catch (Exception e) {
            newCustomer = null;
        }

        return newCustomer;
    }

    // Поиск авторизированного пользователя
    public Customer findAuth(HttpServletRequest request) {
        Cookie authCookie = GlobalCookies.getCookieInHttpRequest(request, GlobalCookies.AUTH_CODE);
        Customer customer = null;
        if (authCookie != null) {
            customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCookie.getValue());
            if (customer != null) {
                // Установить дату последнего визита
            }
        }

        return customer;
    }

    // Вход пользователя
    public Customer entry(HttpServletResponse response, Customer customer) {
        Customer fullCustomer = null;
        if (response != null && customer != null) {
            fullCustomer = CUSTOMER_CRUD_REPOSITORY.findByLoginAndPassword(
                    customer.getLogin(), customer.getPassword());
            if (fullCustomer != null) {
                GlobalCookies.addCookieInHttpResponse(response, GlobalCookies.AUTH_CODE, fullCustomer.getAuthCode());
            }
        }

        return fullCustomer;
    }

    // Выход пользователя
    public void exit(HttpServletResponse response) {
        GlobalCookies.deleteCookieInHttpResponse(response, GlobalCookies.AUTH_CODE);
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
}
