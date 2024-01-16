package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.controllers.rest.CustomersRestController;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.customer.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerRequestDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.global.GlobalCookies;
import ru.herooo.mylanguageweb.global.GlobalCookiesUtils;
import ru.herooo.mylanguageweb.services.CustomerService;

@Controller
@RequestMapping("/customers")
public class CustomersController {
    private final String CUSTOMER_REQUEST_DTO_ATTRIBUTE_NAME = "CUSTOMER_REQUEST_DTO";
    private final String CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME = "CUSTOMER_ENTRY_REQUEST_DTO";

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    public CustomersController(CustomersRestController customersRestController,
                               CustomerService customerService,
                               ControllerUtils controllerUtils) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.CUSTOMER_SERVICE = customerService;
        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping("/new")
    public String showNewPage(HttpServletRequest request,
                              @ModelAttribute(CUSTOMER_REQUEST_DTO_ATTRIBUTE_NAME) CustomerRequestDTO dto) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer == null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        } else {
            return Redirects.INDEX.REDIRECT_URL;
        }
    }

    @PostMapping
    public String register(HttpServletRequest request, HttpServletResponse response,
                           @ModelAttribute(CUSTOMER_REQUEST_DTO_ATTRIBUTE_NAME)
                                @Valid CustomerRequestDTO customerRequestDTO,
                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        }

        ResponseEntity<?> responseEntity = CUSTOMERS_REST_CONTROLLER.register(customerRequestDTO, bindingResult);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            CustomerResponseDTO responseDTO = (CustomerResponseDTO) responseEntity.getBody();
            Customer customer = CUSTOMER_SERVICE.findById(responseDTO.getId());

            CustomerEntryRequestDTO requestDTO = new CustomerEntryRequestDTO();
            requestDTO.setLogin(customer.getLogin());
            requestDTO.setPassword(customer.getPassword());

            return entry(request, response, requestDTO, bindingResult);
        } else {
            CustomResponseMessage message = (CustomResponseMessage) responseEntity.getBody();
            bindingResult.addError(new ObjectError("register_error", message.getText()));

            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        }
    }

    @GetMapping("/entry")
    public String showEntryPage(HttpServletRequest request,
                                @ModelAttribute(CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME) CustomerEntryRequestDTO dto) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer == null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);

            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        } else {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Redirects.INDEX.REDIRECT_URL;
        }
    }

    @PostMapping("/entry")
    public String entry(HttpServletRequest request, HttpServletResponse response,
                        @ModelAttribute(CUSTOMER_ENTRY_REQUEST_DTO_ATTRIBUTE_NAME)
                            @Valid CustomerEntryRequestDTO customerEntryRequestDTO,
                        BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        }

        ResponseEntity<?> responseEntity = CUSTOMERS_REST_CONTROLLER.entry(customerEntryRequestDTO, bindingResult);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            CustomerResponseDTO dto = (CustomerResponseDTO) responseEntity.getBody();
            Customer customer = CUSTOMER_SERVICE.findById(dto.getId());
            if (customer != null) {
                GlobalCookiesUtils.addCookieInHttpResponse
                        (response, GlobalCookies.AUTH_CODE, customer.getAuthCode());
                GlobalCookiesUtils.addCookieInHttpResponse
                        (response, GlobalCookies.AUTH_ID, String.valueOf(customer.getId()));
            }

            return Redirects.INDEX.REDIRECT_URL;
        } else {
            CustomResponseMessage message = (CustomResponseMessage) responseEntity.getBody();
            bindingResult.addError(new ObjectError("entry_error",
                    message.getText()));

            CONTROLLER_UTILS.setGeneralAttributes(request);
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        }
    }

    @GetMapping("/exit")
    public String exit(HttpServletResponse response) {
        CUSTOMER_SERVICE.exit(response);
        return Redirects.INDEX.REDIRECT_URL;
    }

    @GetMapping("/{id}")
    public String showCustomerPage(HttpServletRequest request,
                                   @PathVariable("id") Long id) {
        CONTROLLER_UTILS.setGeneralAttributes(request);
        CONTROLLER_UTILS.changeDateLastVisitToAuthCustomer(request);

        Customer customer = CUSTOMER_SERVICE.findById(id);
        if (customer != null) {
            request.setAttribute("showCustomer", customer);
            return Views.CUSTOMERS_SHOW_ONE.PATH_TO_FILE;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
