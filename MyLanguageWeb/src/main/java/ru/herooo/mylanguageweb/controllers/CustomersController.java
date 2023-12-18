package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageweb.controllers.move.Redirects;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.dto.customer.CustomerRegValidDTO;
import ru.herooo.mylanguageweb.global.GlobalAttributes;
import ru.herooo.mylanguageweb.services.CustomerService;

@Controller
@RequestMapping("/customers")
public class CustomersController {
    private final String CUSTOMER_REG_VALID_DTO_ATTRIBUTE_NAME = "CUSTOMER_REG_VALID_DTO";
    private final String CUSTOMER_ENTRY_ATTRIBUTE_NAME = "CUSTOMER_ENTRY";

    private final CustomerService CUSTOMER_SERVICE;

    @Autowired
    public CustomersController(CustomerService customerService) {
        this.CUSTOMER_SERVICE = customerService;
    }

    @GetMapping("/new")
    public String showNewPage(HttpServletRequest request, Model model) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer == null) {
            GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);
            model.addAttribute(CUSTOMER_REG_VALID_DTO_ATTRIBUTE_NAME, new CustomerRegValidDTO());
            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        } else {
            return Redirects.INDEX.REDIRECT_URL;
        }
    }

    @PostMapping
    public String register(HttpServletResponse response,
                           @ModelAttribute(CUSTOMER_REG_VALID_DTO_ATTRIBUTE_NAME)
                                @Valid CustomerRegValidDTO customerRegValidDTO,
                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        }

        Customer customer = CUSTOMER_SERVICE.register(customerRegValidDTO);
        if (customer != null) {
            CUSTOMER_SERVICE.entry(response, customer);
            return Redirects.INDEX.REDIRECT_URL;
        } else {
            bindingResult.addError(new ObjectError("register_error",
                    "Произошла ошибка на стороне сервера. Попробуйте ещё раз."));
            return Views.CUSTOMERS_NEW.PATH_TO_FILE;
        }
    }

    @GetMapping("/entry")
    public String showEntryPage(HttpServletRequest request, Model model) {
        Customer authCustomer = CUSTOMER_SERVICE.findAuth(request);
        if (authCustomer == null) {
            GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);
            model.addAttribute(CUSTOMER_ENTRY_ATTRIBUTE_NAME, new Customer());
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        } else {
            return Redirects.INDEX.REDIRECT_URL;
        }
    }

    @PostMapping("/entry")
    public String entry(HttpServletResponse response,
                        @ModelAttribute(CUSTOMER_ENTRY_ATTRIBUTE_NAME)
                            @Valid Customer customer,
                        BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        }

        Customer fullCustomer = CUSTOMER_SERVICE.entry(response, customer);
        if (fullCustomer != null) {
            return Redirects.INDEX.REDIRECT_URL;
        } else {
            bindingResult.addError(new ObjectError("entry_error",
                    "Неправильный логин или пароль"));
            return Views.CUSTOMERS_ENTRY.PATH_TO_FILE;
        }
    }

    @GetMapping("/exit")
    public String exit(HttpServletResponse response) {
        CUSTOMER_SERVICE.exit(response);
        return Redirects.INDEX.REDIRECT_URL;
    }

    @GetMapping("/{id}")
    public String showCustomerPage(HttpServletRequest request, Model model,
                                   @PathVariable("id") Long id) {
        GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);
        model.addAttribute(GlobalAttributes.AUTH_CUSTOMER.ATTRIBUTE_NAME, CUSTOMER_SERVICE.findAuth(request));

        Customer customer = CUSTOMER_SERVICE.findById(id);
        if (customer != null) {
            model.addAttribute("showCustomer", customer);
            return Views.CUSTOMERS_SHOW_ONE.PATH_TO_FILE;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
