package ru.herooo.mylanguageweb.dto.entity.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Country;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.country.CountryMapping;
import ru.herooo.mylanguageweb.dto.entity.country.response.CountryResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.edit.CustomerEditRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.CustomerAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customerrole.CustomerRoleMapping;
import ru.herooo.mylanguageweb.dto.entity.customerrole.response.CustomerRoleResponseDTO;
import ru.herooo.mylanguageweb.services.CountryService;
import ru.herooo.mylanguageweb.services.CustomerRoleService;

import java.io.File;

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

    public Customer mapToCustomer(CustomerAddRequestDTO dto) {
        Customer customer = new Customer();

        String nickname = dto.getNickname();
        if (!STRING_UTILS.isStringVoid(nickname)) {
            nickname = nickname.trim();
            customer.setNickname(nickname);
        }

        String email = dto.getEmail();
        if (!STRING_UTILS.isStringVoid(email)) {
            email = email.trim();
            customer.setEmail(email);
        }

        String login = dto.getLogin();
        if (!STRING_UTILS.isStringVoid(login)) {
            login = login.trim();
            customer.setLogin(login);
        }

        String password = dto.getPassword();
        if (!STRING_UTILS.isStringVoid(password)) {
            customer.setPassword(password);
        }

        String countryCode = dto.getCountryCode();
        if (!STRING_UTILS.isStringVoid(countryCode)) {
            Country country = COUNTRY_SERVICE.find(countryCode);
            customer.setCountry(country);
        }

        return customer;
    }

    public Customer mapToCustomer(Customer customer, File avatarFile, CustomerEditRequestDTO dto) {
        if (customer != null) {
            if (avatarFile != null && avatarFile.exists()) {
                customer.setPathToAvatar("/customers/avatar/" + avatarFile.getName());
            }

            String nickname = dto.getNickname();
            if (!STRING_UTILS.isStringVoid(nickname)) {
                nickname = nickname.trim();
                customer.setNickname(nickname);
            }

            String countryCode = dto.getCountryCode();
            if (!STRING_UTILS.isStringVoid(countryCode)) {
                Country country = COUNTRY_SERVICE.find(countryCode);
                customer.setCountry(country);
            }

            customer.setDescription(dto.getDescription());
        }

        return customer;
    }

    public CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setNickname(customer.getNickname());
        dto.setPathToAvatar(customer.getPathToAvatar());
        dto.setDescription(customer.getDescription());
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
