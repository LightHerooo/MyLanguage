package ru.herooo.mylanguageweb.controllers.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageutils.outsidefolder.OutsideFolders;
import ru.herooo.mylanguageweb.controllers.Redirects;
import ru.herooo.mylanguageweb.controllers.Views;
import ru.herooo.mylanguageweb.dto.entity.customer.request.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
@RequestMapping("/customers")
public class CustomersController {
    private final String CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME = "CUSTOMER_ENTRY_REQUEST_DTO";
    private final String CURRENT_CUSTOMER_ATTRIBUTE_NAME = "CURRENT_CUSTOMER";
    private final String DATE_OF_CREATE_ATTRIBUTE_NAME = "DATE_OF_CREATE";
    private final String DATE_OF_LAST_VISIT_ATTRIBUTE_NAME = "DATE_OF_LAST_VISIT";
    private final String IS_CUSTOMER_OWNER_ATTRIBUTE_NAME = "IS_CUSTOMER_OWNER";

    private final String DEFAULT_AVATAR_FILE_NAME = "default.png";


    private final CustomerService CUSTOMER_SERVICE;

    private final CustomerMapping CUSTOMER_MAPPING;

    private final ControllerUtils CONTROLLER_UTILS;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomersController(CustomerService customerService,

                               CustomerMapping customerMapping,

                               ControllerUtils controllerUtils,
                               StringUtils stringUtils) {
        this.CUSTOMER_SERVICE = customerService;

        this.CUSTOMER_MAPPING = customerMapping;

        this.CONTROLLER_UTILS = controllerUtils;
        this.STRING_UTILS = stringUtils;
    }

    @GetMapping("/registration")
    public String showRegistrationPage(HttpServletRequest request,
                                       @ModelAttribute(CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME) CustomerEntryRequestDTO dto) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer == null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CUSTOMER_SERVICE.changeDateOfLastVisit(request);

            return Views.CUSTOMERS_REGISTRATION.PATH_TO_FILE;
        } else {
            return Redirects.INDEX.REDIRECT_URL;
        }
    }

    @GetMapping("/entry")
    public String showEntryPage(HttpServletRequest request,
                                @ModelAttribute(CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME) CustomerEntryRequestDTO dto) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);

        CONTROLLER_UTILS.setGeneralAttributes(request);
        return authCustomer != null ? Redirects.INDEX.REDIRECT_URL : Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
    }

    @GetMapping("/exit")
    public String exit(HttpServletResponse response) {
        CUSTOMER_SERVICE.exit(response);
        return Redirects.INDEX.REDIRECT_URL;
    }

    @GetMapping("/info/{id}")
    public String showCustomerPage(HttpServletRequest request,
                                   @PathVariable("id") Long id) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CUSTOMER_SERVICE.changeDateOfLastVisit(request);

        Customer customer = CUSTOMER_SERVICE.find(id);
        if (customer != null) {
            // Преобразуем в response
            CustomerResponseDTO currentCustomer = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            request.setAttribute(CURRENT_CUSTOMER_ATTRIBUTE_NAME, currentCustomer);

            // Генерируем строку даты регистрации
            String dateOfCreate = STRING_UTILS.createDateWithTimeStr(customer.getDateOfCreate());
            request.setAttribute(DATE_OF_CREATE_ATTRIBUTE_NAME, dateOfCreate);

            // Генерируем строку последнего визита
            String dateOfLastVisit = STRING_UTILS.createDateWithTimeStr(customer.getDateOfLastVisit());
            request.setAttribute(DATE_OF_LAST_VISIT_ATTRIBUTE_NAME, dateOfLastVisit);

            // Проверяем, является ли пользователь владельцем профиля
            Customer authCustomer = CUSTOMER_SERVICE.find(request);
            request.setAttribute(IS_CUSTOMER_OWNER_ATTRIBUTE_NAME, customer.equals(authCustomer));

            return Views.CUSTOMERS_SHOW_INFO_ONE.PATH_TO_FILE;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/edit")
    public String showEditPage(HttpServletRequest request) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CUSTOMER_SERVICE.changeDateOfLastVisit(request);

        return Views.CUSTOMERS_EDIT.PATH_TO_FILE;
    }

    @GetMapping("/avatars/{avatar_name}")
    @ResponseBody
    public ResponseEntity<?> getAvatar(@PathVariable("avatar_name") String avatarName) {
        OutsideFolder currentFolder = OutsideFolders.CUSTOMER_AVATARS.FOLDER;

        File file = currentFolder.getFile(avatarName);
        if (file == null || !file.exists()) {
            file = currentFolder.getFile(DEFAULT_AVATAR_FILE_NAME);
        }

        byte[] bytes;
        try (FileInputStream fis = new FileInputStream(file.getPath())) {
            bytes = fis.readAllBytes();
        } catch (IOException e) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Не удалось прочитать аватар");
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(bytes);
    }



    @PostMapping("/entry")
    public String entry(HttpServletRequest request,
                        HttpServletResponse response,
                        @ModelAttribute(CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME) CustomerEntryRequestDTO dto,
                        BindingResult bindingResult) {
        // Ищем пользователя по логину и паролю
        Customer customer = CUSTOMER_SERVICE.find(dto);
        if (customer == null) {
            bindingResult.addError(new ObjectError("entry_error",
                    "Неправильный логин или пароль"));

            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        }

        CUSTOMER_SERVICE.entry(response, customer);
        return Redirects.INDEX.REDIRECT_URL;
    }
}
