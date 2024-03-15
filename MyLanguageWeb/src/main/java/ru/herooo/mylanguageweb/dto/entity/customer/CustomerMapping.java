package ru.herooo.mylanguageweb.dto.entity.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Country;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.country.CountryMapping;
import ru.herooo.mylanguageweb.dto.entity.country.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customerrole.CustomerRoleMapping;
import ru.herooo.mylanguageweb.dto.entity.customerrole.CustomerRoleResponseDTO;
import ru.herooo.mylanguageweb.services.CountryService;
import ru.herooo.mylanguageweb.services.CustomerRoleService;

@Service
public class CustomerMapping {
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;
    private final CountryService COUNTRY_SERVICE;

    private final CustomerRoleMapping CUSTOMER_ROLE_MAPPING;
    private final CountryMapping COUNTRY_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerMapping(CustomerRoleService customerRoleService,
                           CountryService countryService,

                           CustomerRoleMapping customerRoleMapping,
                           CountryMapping countryMapping,

                           StringUtils stringUtils) {
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;
        this.COUNTRY_SERVICE = countryService;

        this.CUSTOMER_ROLE_MAPPING = customerRoleMapping;
        this.COUNTRY_MAPPING = countryMapping;

        this.STRING_UTILS = stringUtils;
    }

    // Маппинг для добавления (все вносимые поля не могут быть изменены)
    public Customer mapToCustomer(CustomerRequestDTO dto) {
        Customer customer = new Customer();

        String email = dto.getEmail();
        if (STRING_UTILS.isNotStringVoid(email)) {
            email = email.trim();
            customer.setEmail(email);
        }

        String login = dto.getLogin();
        if (STRING_UTILS.isNotStringVoid(login)) {
            login = login.trim();
            customer.setLogin(login);
        }

        return mapToCustomer(customer, dto);
    }

    // Маппинг для изменения (все вносимые поля могут быть изменены)
    public Customer mapToCustomer(Customer oldCustomer, CustomerRequestDTO dto) {
        String nickname = dto.getNickname();
        if (STRING_UTILS.isNotStringVoid(nickname)) {
            nickname = nickname.trim();
            if (STRING_UTILS.isNotStringVoid(nickname)) {
                oldCustomer.setNickname(nickname);
            }
        }

        String password = dto.getPassword();
        if (STRING_UTILS.isNotStringVoid(password)) {
            oldCustomer.setPassword(password);
        }

        String roleCode = dto.getRoleCode();
        if (STRING_UTILS.isNotStringVoid(roleCode)) {
            CustomerRole role = CUSTOMER_ROLE_SERVICE.find(roleCode);
            if (role != null) {
                oldCustomer.setRole(role);
            }
        }

        String countryCode = dto.getCountryCode();
        if (STRING_UTILS.isNotStringVoid(countryCode)) {
            Country country = COUNTRY_SERVICE.find(countryCode);
            if (country != null) {
                oldCustomer.setCountry(country);
            }
        }

        return oldCustomer;
    }

    public CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setNickname(customer.getNickname());
        dto.setDateOfCreate(customer.getDateOfCreate());
        dto.setDateOfLastVisit(customer.getDateOfLastVisit());

        if (customer.getRole() != null) {
            CustomerRoleResponseDTO role = CUSTOMER_ROLE_MAPPING.mapToResponseDTO(customer.getRole());
            dto.setRole(role);
        }

        if (customer.getCountry() != null) {
            CountryResponseDTO country = COUNTRY_MAPPING.mapToResponseDTO(customer.getCountry());
            dto.setCountry(country);
        }

        return dto;
    }
}
