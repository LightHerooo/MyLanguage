package ru.herooo.mylanguageweb.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoleCrudRepository;
import ru.herooo.mylanguagedb.repositories.customerrole.CustomerRoles;
import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.outsidefolder.OutsideFolders;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.*;
import ru.herooo.mylanguageweb.dto.entity.customer.request.edit.CustomerEditRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.CustomerAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.projectcookie.ProjectCookies;
import ru.herooo.mylanguageweb.projectcookie.ProjectCookiesUtils;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final CustomerRoleCrudRepository CUSTOMER_ROLE_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final StringUtils STRING_UTILS;
    private final FileUtils FILE_UTILS;
    private final ProjectCookiesUtils PROJECT_COOKIES_UTILS;

    @Autowired
    public CustomerService(CustomerCrudRepository customerCrudRepository,
                           CustomerRoleCrudRepository customerRoleCrudRepository,

                           CustomerMapping customerMapping,

                           StringUtils stringUtils,
                           FileUtils fileUtils,
                           ProjectCookiesUtils projectCookiesUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.CUSTOMER_ROLE_CRUD_REPOSITORY = customerRoleCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;

        this.STRING_UTILS = stringUtils;
        this.FILE_UTILS = fileUtils;
        this.PROJECT_COOKIES_UTILS = projectCookiesUtils;
    }

    private String createNewAuthKey() {
        return STRING_UTILS.createRandomStrEn(50);
    }

    public List<Customer> getAll(String nickname,
                                 String customerRoleCode,
                                 Long numberOfItems,
                                 Long lastCustomerIdOnPreviousPage) {
        return CUSTOMER_CRUD_REPOSITORY
                .findAll(nickname, customerRoleCode, numberOfItems, lastCustomerIdOnPreviousPage);
    }



    public Customer add(CustomerAddRequestDTO dto) {
        Customer newCustomer = CUSTOMER_MAPPING.mapToCustomer(dto);

        CustomerRole cr = CUSTOMER_ROLE_CRUD_REPOSITORY.find(CustomerRoles.CUSTOMER).orElse(null);
        newCustomer.setRole(cr);

        newCustomer.setAuthKey(this.createNewAuthKey());
        newCustomer.setDateOfCreate(LocalDateTime.now());
        newCustomer.setDateOfLastVisit(LocalDateTime.now());

        return CUSTOMER_CRUD_REPOSITORY.save(newCustomer);
    }

    public Customer edit(Customer customer, MultipartFile avatar, CustomerEditRequestDTO dto) {
        // Создаём новое изображение (если необходимо)
        File avatarFile = null;
        if (avatar != null && !avatar.isEmpty()) {
            String fileName = avatar.getOriginalFilename();
            if (fileName != null) {
                try {
                    OutsideFolder outsideFolder = OutsideFolders.CUSTOMER_AVATARS.FOLDER;

                    avatarFile = outsideFolder.createNewFile(avatar.getBytes(), fileName, true);
                    if (avatarFile != null && avatarFile.exists()) {
                        // Удаляем предыдущую аватарку
                        String oldFileName = FILE_UTILS.getFileName(customer.getPathToAvatar());
                        if (!STRING_UTILS.isStringVoid(oldFileName)) {
                            outsideFolder.deleteFile(oldFileName);
                        }
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        Customer resultCustomer = CUSTOMER_MAPPING.mapToCustomer(customer, avatarFile, dto);
        return CUSTOMER_CRUD_REPOSITORY.save(resultCustomer);
    }

    public Customer editPassword(Customer customer, String password) {
        customer.setPassword(password);
        customer.setAuthKey(this.createNewAuthKey());

        return CUSTOMER_CRUD_REPOSITORY.save(customer);
    }

    public Customer editRole(Customer customer, CustomerRole customerRole) {
        customer.setRole(customerRole);
        return CUSTOMER_CRUD_REPOSITORY.save(customer);
    }

    public Customer find(HttpServletRequest request) {
        Cookie customerAuthKey = PROJECT_COOKIES_UTILS.get(request, ProjectCookies.CUSTOMER_AUTH_KEY);

        Customer customer = null;
        if (customerAuthKey != null) {
            customer = CUSTOMER_CRUD_REPOSITORY.findByAuthKey(customerAuthKey.getValue()).orElse(null);
            if (customer != null) {
                customer.setDateOfLastVisit(LocalDateTime.now());
                CUSTOMER_CRUD_REPOSITORY.save(customer);
            }
        }

        return customer;
    }

    public Customer find(CustomerEntryRequestDTO dto) {
        return CUSTOMER_CRUD_REPOSITORY.findByLoginAndPassword(
                dto.getLogin(), dto.getPassword()).orElse(null);
    }



    public Customer find(Long id) {
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

    public Customer findByAuthKey(String authKey) {
        return CUSTOMER_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
    }



    public String validateAuthKey(HttpServletRequest request, String authKey) {
        String validAuthKey = null;

        try {
            if (STRING_UTILS.isStringVoid(authKey)) {
                Cookie customerAuthKey = PROJECT_COOKIES_UTILS.get(request, ProjectCookies.CUSTOMER_AUTH_KEY);
                validAuthKey = customerAuthKey != null
                        ? customerAuthKey.getValue()
                        : authKey;
            } else {
                validAuthKey = authKey;
            }
        } catch (Throwable e) {
            validAuthKey = authKey;
        }

        return validAuthKey;
    }

    public boolean isAdmin(Customer customer) {
        return customer != null && (customer.getRole().getId() == CustomerRoles.ADMIN.ID);
    }

    public boolean isModerator(Customer customer) {
        return customer != null && (customer.getRole().getId() == CustomerRoles.MODERATOR.ID);
    }

    public boolean isSuperUser(Customer customer) {
        return customer != null && (isAdmin(customer) || isModerator(customer));
    }


    public void entry(HttpServletResponse response, Customer customer) {
        if (response != null && customer != null) {
            this.exit(response);

            PROJECT_COOKIES_UTILS.add(response, ProjectCookies.CUSTOMER_AUTH_KEY, customer.getAuthKey());
            PROJECT_COOKIES_UTILS.add(response, ProjectCookies.CUSTOMER_ID, String.valueOf(customer.getId()));
        }
    }

    public void exit(HttpServletResponse response) {
        if (response != null) {
            PROJECT_COOKIES_UTILS.delete(response, ProjectCookies.CUSTOMER_AUTH_KEY);
            PROJECT_COOKIES_UTILS.delete(response, ProjectCookies.CUSTOMER_ID);
        }
    }

    public void changeDateOfLastVisit(HttpServletRequest request) {
        Customer authCustomer = find(request);
        if (authCustomer != null) {
            authCustomer.setDateOfLastVisit(LocalDateTime.now());
            CUSTOMER_CRUD_REPOSITORY.save(authCustomer);
        }
    }
}
