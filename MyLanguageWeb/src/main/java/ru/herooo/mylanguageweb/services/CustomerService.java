package ru.herooo.mylanguageweb.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoleCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerRequestDTO;
import ru.herooo.mylanguageweb.global.GlobalCookieUtils;
import ru.herooo.mylanguageweb.global.GlobalCookies;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final StringUtils STRING_UTILS;
    private final GlobalCookieUtils GLOBAL_COOKIE_UTILS;

    @Autowired
    public CustomerService(CustomerCrudRepository customerCrudRepository,
                           CustomerRoleCrudRepository customerRoleCrudRepository,
                           CustomerMapping customerMapping,
                           StringUtils stringUtils,
                           GlobalCookieUtils globalCookieUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.CUSTOMER_ROLE_CRUD_REPOSITORY = customerRoleCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.STRING_UTILS = stringUtils;
        this.GLOBAL_COOKIE_UTILS = globalCookieUtils;
    }

    public List<Customer> getAll(String nickname,
                                 String customerRoleCode,
                                 Long numberOfItems,
                                 Long lastCustomerIdOnPreviousPage) {
        return CUSTOMER_CRUD_REPOSITORY
                .findAllAfterFilterWithPagination(nickname, customerRoleCode, numberOfItems, lastCustomerIdOnPreviousPage);
    }

    public Customer add(CustomerRequestDTO dto) {
        Customer newCustomer = CUSTOMER_MAPPING.mapToCustomer(dto);

        CustomerRole cr = CUSTOMER_ROLE_CRUD_REPOSITORY.find(CustomerRoles.CUSTOMER).orElse(null);
        newCustomer.setRole(cr);

        newCustomer.setAuthCode(STRING_UTILS.getRandomStrEn(50));
        newCustomer.setDateOfCreate(LocalDateTime.now());
        newCustomer.setDateOfLastVisit(LocalDateTime.now());

        return CUSTOMER_CRUD_REPOSITORY.save(newCustomer);
    }

    public Customer find(HttpServletRequest request) {
        Cookie authCookie = GLOBAL_COOKIE_UTILS.getCookieInHttpRequest(request, GlobalCookies.AUTH_CODE);
        Customer customer = null;
        if (authCookie != null) {
            customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCookie.getValue()).orElse(null);
            if (customer != null) {
                customer.setDateOfLastVisit(LocalDateTime.now());
                CUSTOMER_CRUD_REPOSITORY.save(customer);
            }
        }

        return customer;
    }

    public Customer find(CustomerRequestDTO dto) {
        return CUSTOMER_CRUD_REPOSITORY.findByLoginAndPassword(
                dto.getLogin(), dto.getPassword()).orElse(null);
    }

    public Customer changeRole(Customer customer, CustomerRole customerRole) {
        Customer result = null;
        if (customer != null && customerRole != null) {
            customer.setRole(customerRole);
            result = CUSTOMER_CRUD_REPOSITORY.save(customer);
        }

        return result;
    }

    public Customer find(long id) {
        return CUSTOMER_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public Customer findByLogin(String login) {
        return CUSTOMER_CRUD_REPOSITORY.findByLogin(login).orElse(null);
    }

    public Customer findByEmail(String email) {
        return CUSTOMER_CRUD_REPOSITORY.findByEmail(email).orElse(null);
    }

    public Customer findByNickname(String nickname) {
        return CUSTOMER_CRUD_REPOSITORY.findByNickname(nickname).orElse(null);
    }

    public Customer findByAuthCode(String authCode) {
        return CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCode).orElse(null);
    }

    public String validateAuthCode(HttpServletRequest request, String authCode) {
        String result;

        try {
            result = STRING_UTILS.isStringVoid(authCode)
                    ? GLOBAL_COOKIE_UTILS.getCookieInHttpRequest(request, GlobalCookies.AUTH_CODE).getValue()
                    : authCode;
        } catch (Throwable e) {
            result = authCode;
        }

        return result;
    }

    public boolean isAdmin(Customer customer) {
        return customer != null && (customer.getRole().getId() == CustomerRoles.ADMIN.getId());
    }

    public boolean isModerator(Customer customer) {
        return customer != null && (customer.getRole().getId() == CustomerRoles.MODERATOR.getId());
    }

    public boolean isSuperUser(Customer customer) {
        return customer != null && (isAdmin(customer) || isModerator(customer));
    }

    public void save(Customer customer) {
        CUSTOMER_CRUD_REPOSITORY.save(customer);
    }
}
